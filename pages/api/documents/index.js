import fs from "fs";
import path from "path";
import {
  UPLOAD_DIR,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  ensureUploadDir,
  sanitizeBaseName,
  getCleanExtension,
  isPathInsideUploadDir,
  resolveDuplicateName,
  parseMultipartFormData,
} from "@/lib/uploadHelper";

export const config = {
  api: {
    bodyParser: false, // Disables standard body parsing to allow streaming multipart files
  },
};

/**
 * Format bytes to readable string (e.g. 1.25 MB)
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
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

export default async function handler(req, res) {
  ensureUploadDir();

  // Set standard security headers
  res.setHeader("X-Content-Type-Options", "nosniff");

  try {
    // ─── GET: List all documents ──────────────────────────────────────────────
    if (req.method === "GET") {
      const files = fs.readdirSync(UPLOAD_DIR);

      const documents = files
        .filter((file) => {
          const filePath = path.join(UPLOAD_DIR, file);
          return fs.statSync(filePath).isFile();
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
          };
        })
        .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));

      return res.status(200).json({
        success: true,
        count: documents.length,
        documents,
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

      // Validate allowed file extension
      if (!ALLOWED_EXTENSIONS.has(originalExt)) {
        return res.status(400).json({
          success: false,
          error: `File extension '.${originalExt || "unknown"}' is not allowed.`,
        });
      }

      // Validate file size limit
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

      // Renaming and extension preservation logic
      const customNameInput = fields.customName || "";
      const baseNameWithoutExt = customNameInput.trim()
        ? sanitizeBaseName(path.parse(customNameInput.trim()).name)
        : sanitizeBaseName(path.parse(uploadedFile.originalFilename).name);

      const conflictStrategy = fields.conflictStrategy || "auto-rename"; // 'auto-rename' | 'overwrite' | 'reject'

      const targetFileName = resolveDuplicateName(
        UPLOAD_DIR,
        baseNameWithoutExt,
        originalExt,
        conflictStrategy
      );

      const targetFilePath = path.join(UPLOAD_DIR, targetFileName);

      // Verify sandboxing
      if (!isPathInsideUploadDir(targetFilePath)) {
        return res.status(403).json({
          success: false,
          error: "Invalid file path destination.",
        });
      }

      // Check conflict if strategy is 'reject'
      if (conflictStrategy === "reject" && fs.existsSync(targetFilePath)) {
        return res.status(409).json({
          success: false,
          error: `A file named '${targetFileName}' already exists.`,
        });
      }

      // Write file buffer safely
      fs.writeFileSync(targetFilePath, uploadedFile.buffer);

      const stats = fs.statSync(targetFilePath);

      return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        document: {
          name: targetFileName,
          originalName: uploadedFile.originalFilename,
          size: stats.size,
          formattedSize: formatBytes(stats.size),
          extension: originalExt,
          modifiedAt: stats.mtime,
          url: `/uploads/documents/${encodeURIComponent(targetFileName)}`,
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

      // Sanitize names to prevent path traversal
      const safeOldName = path.basename(oldName);
      const oldFilePath = path.join(UPLOAD_DIR, safeOldName);

      if (!fs.existsSync(oldFilePath) || !isPathInsideUploadDir(oldFilePath)) {
        return res.status(404).json({
          success: false,
          error: `Original file '${safeOldName}' does not exist.`,
        });
      }

      // Preserve original extension
      const originalExt = getCleanExtension(safeOldName);
      const cleanNewBase = sanitizeBaseName(path.parse(newName).name);
      const finalNewName = originalExt ? `${cleanNewBase}.${originalExt}` : cleanNewBase;
      const newFilePath = path.join(UPLOAD_DIR, finalNewName);

      if (!isPathInsideUploadDir(newFilePath)) {
        return res.status(403).json({
          success: false,
          error: "Destination path is forbidden.",
        });
      }

      if (safeOldName === finalNewName) {
        return res.status(200).json({
          success: true,
          message: "File name is unchanged.",
          name: finalNewName,
          url: `/uploads/documents/${encodeURIComponent(finalNewName)}`,
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
      const targetFilePath = path.join(UPLOAD_DIR, safeFileName);

      if (!isPathInsideUploadDir(targetFilePath) || !fs.existsSync(targetFilePath)) {
        return res.status(404).json({
          success: false,
          error: `File '${safeFileName}' was not found.`,
        });
      }

      fs.unlinkSync(targetFilePath);

      return res.status(200).json({
        success: true,
        message: `File '${safeFileName}' deleted successfully.`,
        deletedName: safeFileName,
      });
    }

    // Disallowed methods
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
