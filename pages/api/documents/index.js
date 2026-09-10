import fs from "fs";
import path from "path";
import {
  UPLOAD_DIR,
  SUPABASE_BUCKET,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  isSupabaseConfigured,
  ensureUploadDir,
  sanitizeBaseName,
  getCleanExtension,
  isPathInsideUploadDir,
  resolveDuplicateName,
  resolveDuplicateNameFromList,
  parseMultipartFormData,
} from "@/lib/uploadHelper";
import { supabase } from "@/lib/supabaseClient";

export const config = {
  api: {
    bodyParser: false, // Streaming multipart file upload support
  },
};

/**
 * Format bytes to readable string (e.g. 1.25 MB)
 */
function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Helper to parse JSON body when bodyParser is false
 */
async function getJsonBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

/**
 * Helper: List local fallback documents
 */
function getLocalDocuments() {
  try {
    ensureUploadDir();
    if (!fs.existsSync(UPLOAD_DIR)) return [];

    const files = fs.readdirSync(UPLOAD_DIR);
    return files
      .filter((file) => {
        const filePath = path.join(UPLOAD_DIR, file);
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
      })
      .map((file) => {
        const filePath = path.join(UPLOAD_DIR, file);
        const stats = fs.statSync(filePath);
        const ext = getCleanExtension(file);

        return {
          name: file,
          size: stats.size,
          formattedSize: formatBytes(stats.size),
          extension: ext,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          url: `/uploads/documents/${encodeURIComponent(file)}`,
          storageProvider: "local",
        };
      })
      .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
  } catch (err) {
    console.error("Local documents read error:", err);
    return [];
  }
}

export default async function handler(req, res) {
  // Standard security headers
  res.setHeader("X-Content-Type-Options", "nosniff");

  const useSupabase = isSupabaseConfigured() && supabase !== null;

  try {
    // ─── GET: List all documents ──────────────────────────────────────────────
    if (req.method === "GET") {
      if (useSupabase) {
        try {
          const { data: fileList, error: listError } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .list("", {
              limit: 100,
              offset: 0,
              sortBy: { column: "created_at", order: "desc" },
            });

          if (!listError && fileList) {
            const documents = fileList
              // Filter out system placeholders or folders if any
              .filter((item) => item.name && item.name !== ".emptyFolderPlaceholder")
              .map((item) => {
                const ext = getCleanExtension(item.name);
                const size = item.metadata?.size || item.size || 0;
                const { data: publicUrlData } = supabase.storage
                  .from(SUPABASE_BUCKET)
                  .getPublicUrl(item.name);

                return {
                  name: item.name,
                  id: item.id,
                  size,
                  formattedSize: formatBytes(size),
                  extension: ext,
                  createdAt: item.created_at || new Date().toISOString(),
                  modifiedAt: item.updated_at || item.created_at || new Date().toISOString(),
                  url: publicUrlData?.publicUrl || `/uploads/documents/${encodeURIComponent(item.name)}`,
                  storageProvider: "supabase",
                };
              });

            return res.status(200).json({
              success: true,
              storageProvider: "supabase",
              count: documents.length,
              documents,
            });
          } else {
            console.warn("Supabase list returned error, checking local fallback:", listError?.message);
          }
        } catch (supabaseErr) {
          console.warn("Supabase connection failed, checking local fallback:", supabaseErr.message);
        }
      }

      // Fallback: local disk
      const localDocs = getLocalDocuments();
      return res.status(200).json({
        success: true,
        storageProvider: "local",
        count: localDocs.length,
        documents: localDocs,
      });
    }

    // ─── POST: Upload document ────────────────────────────────────────────────
    if (req.method === "POST") {
      const { fields, files } = await parseMultipartFormData(req);

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No file was uploaded.",
        });
      }

      const uploadedFile = files[0];
      const originalExt = getCleanExtension(uploadedFile.originalFilename);

      // Validate allowed extension
      if (!ALLOWED_EXTENSIONS.has(originalExt)) {
        return res.status(400).json({
          success: false,
          error: `File extension '.${originalExt || "unknown"}' is not allowed.`,
        });
      }

      // Validate file size
      if (uploadedFile.size > MAX_FILE_SIZE) {
        return res.status(413).json({
          success: false,
          error: `File size exceeds the maximum limit of ${formatBytes(MAX_FILE_SIZE)}.`,
        });
      }

      if (uploadedFile.size === 0) {
        return res.status(400).json({
          success: false,
          error: "Uploaded file is empty.",
        });
      }

      // Compute base name
      const customNameInput = fields.customName || "";
      const baseNameWithoutExt = customNameInput.trim()
        ? sanitizeBaseName(path.parse(customNameInput.trim()).name)
        : sanitizeBaseName(path.parse(uploadedFile.originalFilename).name);

      const conflictStrategy = fields.conflictStrategy || "auto-rename";

      // 1. Try Supabase Storage Upload
      if (useSupabase) {
        try {
          // Fetch existing files to resolve duplicate naming
          const { data: existingList } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .list("", { limit: 200 });

          const existingNames = (existingList || []).map((f) => f.name);
          const targetFileName = resolveDuplicateNameFromList(
            existingNames,
            baseNameWithoutExt,
            originalExt,
            conflictStrategy
          );

          if (conflictStrategy === "reject" && existingNames.includes(targetFileName)) {
            return res.status(409).json({
              success: false,
              error: `A file named '${targetFileName}' already exists in storage.`,
            });
          }

          let { data: uploadResult, error: uploadErr } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .upload(targetFileName, uploadedFile.buffer, {
              contentType: uploadedFile.mimeType || "application/octet-stream",
              upsert: conflictStrategy === "overwrite",
            });

          // If bucket is not found, attempt to auto-create it and retry
          if (uploadErr && (uploadErr.message?.includes("Bucket not found") || uploadErr.statusCode === "404" || uploadErr.error === "Bucket not found")) {
            console.log(`Bucket '${SUPABASE_BUCKET}' not found, attempting auto-creation...`);
            const { error: createBucketErr } = await supabase.storage.createBucket(SUPABASE_BUCKET, {
              public: true,
              fileSizeLimit: MAX_FILE_SIZE,
            });

            if (!createBucketErr) {
              console.log(`Bucket '${SUPABASE_BUCKET}' created successfully, retrying upload...`);
              const retry = await supabase.storage
                .from(SUPABASE_BUCKET)
                .upload(targetFileName, uploadedFile.buffer, {
                  contentType: uploadedFile.mimeType || "application/octet-stream",
                  upsert: conflictStrategy === "overwrite",
                });
              uploadResult = retry.data;
              uploadErr = retry.error;
            }
          }

          if (uploadErr) {
            console.error("Supabase upload error:", uploadErr);
            if (uploadErr.message?.includes("Bucket not found") || uploadErr.statusCode === "404" || uploadErr.error === "Bucket not found") {
              return res.status(500).json({
                success: false,
                error: `Supabase Storage bucket '${SUPABASE_BUCKET}' not found. Please create a public bucket named '${SUPABASE_BUCKET}' in your Supabase dashboard under Storage -> New Bucket.`,
              });
            }
            throw uploadErr;
          }

          const { data: publicUrlData } = supabase.storage
            .from(SUPABASE_BUCKET)
            .getPublicUrl(targetFileName);

          return res.status(201).json({
            success: true,
            storageProvider: "supabase",
            message: "File uploaded successfully to Supabase Storage",
            document: {
              name: targetFileName,
              originalName: uploadedFile.originalFilename,
              size: uploadedFile.size,
              formattedSize: formatBytes(uploadedFile.size),
              extension: originalExt,
              modifiedAt: new Date().toISOString(),
              url: publicUrlData?.publicUrl || "",
              storageProvider: "supabase",
            },
          });
        } catch (supabaseErr) {
          console.error("Supabase upload failed:", supabaseErr);
          // If in serverless (e.g. Vercel) and Supabase fails, report the error directly
          if (process.env.VERCEL) {
            return res.status(500).json({
              success: false,
              error: `Upload to Supabase Storage failed: ${supabaseErr.message || "Unknown error"}`,
            });
          }
          // In local dev, proceed to fallback
        }
      }

      // 2. Local Filesystem Fallback (Local Development Only)
      ensureUploadDir();
      const targetFileName = resolveDuplicateName(
        UPLOAD_DIR,
        baseNameWithoutExt,
        originalExt,
        conflictStrategy
      );
      const targetFilePath = path.join(UPLOAD_DIR, targetFileName);

      if (!isPathInsideUploadDir(targetFilePath)) {
        return res.status(403).json({
          success: false,
          error: "Invalid file destination.",
        });
      }

      if (conflictStrategy === "reject" && fs.existsSync(targetFilePath)) {
        return res.status(409).json({
          success: false,
          error: `A file named '${targetFileName}' already exists.`,
        });
      }

      fs.writeFileSync(targetFilePath, uploadedFile.buffer);
      const stats = fs.statSync(targetFilePath);

      return res.status(201).json({
        success: true,
        storageProvider: "local",
        message: "File uploaded successfully to local storage",
        document: {
          name: targetFileName,
          originalName: uploadedFile.originalFilename,
          size: stats.size,
          formattedSize: formatBytes(stats.size),
          extension: originalExt,
          modifiedAt: stats.mtime,
          url: `/uploads/documents/${encodeURIComponent(targetFileName)}`,
          storageProvider: "local",
        },
      });
    }

    // ─── PATCH: Rename existing document ──────────────────────────────────────
    if (req.method === "PATCH") {
      const body = await getJsonBody(req);
      const { oldName, newName } = body;

      if (!oldName || !newName) {
        return res.status(400).json({
          success: false,
          error: "Both oldName and newName are required.",
        });
      }

      const safeOldName = path.basename(oldName);
      const originalExt = getCleanExtension(safeOldName);
      const cleanNewBase = sanitizeBaseName(path.parse(newName).name);
      const finalNewName = originalExt ? `${cleanNewBase}.${originalExt}` : cleanNewBase;

      if (safeOldName === finalNewName) {
        return res.status(200).json({
          success: true,
          message: "File name is unchanged.",
          name: finalNewName,
        });
      }

      // 1. Try Supabase Rename (move)
      if (useSupabase) {
        try {
          const { data: moveData, error: moveError } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .move(safeOldName, finalNewName);

          if (!moveError) {
            const { data: publicUrlData } = supabase.storage
              .from(SUPABASE_BUCKET)
              .getPublicUrl(finalNewName);

            return res.status(200).json({
              success: true,
              storageProvider: "supabase",
              message: "File renamed successfully",
              oldName: safeOldName,
              name: finalNewName,
              extension: originalExt,
              url: publicUrlData?.publicUrl || "",
            });
          } else {
            console.warn("Supabase rename error, checking local fallback:", moveError.message);
          }
        } catch (supabaseErr) {
          console.warn("Supabase move failed:", supabaseErr);
        }
      }

      // 2. Local Fallback
      const oldFilePath = path.join(UPLOAD_DIR, safeOldName);
      const newFilePath = path.join(UPLOAD_DIR, finalNewName);

      if (!fs.existsSync(oldFilePath) || !isPathInsideUploadDir(oldFilePath)) {
        return res.status(404).json({
          success: false,
          error: `Original file '${safeOldName}' was not found.`,
        });
      }

      if (fs.existsSync(newFilePath)) {
        return res.status(409).json({
          success: false,
          error: `A file named '${finalNewName}' already exists.`,
        });
      }

      fs.renameSync(oldFilePath, newFilePath);
      const stats = fs.statSync(newFilePath);

      return res.status(200).json({
        success: true,
        storageProvider: "local",
        message: "File renamed successfully",
        oldName: safeOldName,
        name: finalNewName,
        formattedSize: formatBytes(stats.size),
        extension: originalExt,
        modifiedAt: stats.mtime,
        url: `/uploads/documents/${encodeURIComponent(finalNewName)}`,
      });
    }

    // ─── DELETE: Delete document ──────────────────────────────────────────────
    if (req.method === "DELETE") {
      const body = await getJsonBody(req);
      const fileNameParam = (req.query && req.query.name) || body.name;

      if (!fileNameParam) {
        return res.status(400).json({
          success: false,
          error: "File name is required to delete.",
        });
      }

      const safeFileName = path.basename(fileNameParam);

      // 1. Try Supabase Storage Delete
      if (useSupabase) {
        try {
          const { data: removeData, error: removeError } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .remove([safeFileName]);

          if (!removeError) {
            return res.status(200).json({
              success: true,
              storageProvider: "supabase",
              message: `File '${safeFileName}' deleted successfully from Supabase Storage.`,
              deletedName: safeFileName,
            });
          } else {
            console.warn("Supabase remove error:", removeError.message);
          }
        } catch (supabaseErr) {
          console.warn("Supabase delete failed:", supabaseErr);
        }
      }

      // 2. Local Fallback
      const targetFilePath = path.join(UPLOAD_DIR, safeFileName);
      if (fs.existsSync(targetFilePath) && isPathInsideUploadDir(targetFilePath)) {
        fs.unlinkSync(targetFilePath);
        return res.status(200).json({
          success: true,
          storageProvider: "local",
          message: `File '${safeFileName}' deleted successfully.`,
          deletedName: safeFileName,
        });
      }

      return res.status(404).json({
        success: false,
        error: `File '${safeFileName}' was not found.`,
      });
    }

    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} is not allowed.`,
    });
  } catch (error) {
    console.error("Documents API Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
