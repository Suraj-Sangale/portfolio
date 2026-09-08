import fs from "fs";
import path from "path";

// Sandboxed upload target directory
export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "documents");

// Allowed file extensions
export const ALLOWED_EXTENSIONS = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "txt", "csv", "md", "json", "rtf", "odt", "ods", "odp",
  "png", "jpg", "jpeg", "webp", "gif", "svg",
  "zip", "tar", "gz", "7z", "rar"
]);

// Allowed MIME types
export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
  "application/rtf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-tar",
  "application/gzip",
  "application/x-7z-compressed",
  "application/vnd.rar",
  "application/octet-stream"
]);

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB limit

/**
 * Ensure sandboxed upload directory exists
 */
export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Sanitize a string to be a safe filesystem base name (without extension)
 */
export function sanitizeBaseName(name) {
  if (!name || typeof name !== "string") return "document";
  // Remove path traversal and dangerous characters
  const cleaned = name
    .replace(/[\\/:\*\?"<>\|]/g, "_")
    .replace(/\.\./g, "_")
    .trim();
  return cleaned || "document";
}

/**
 * Extract clean extension without leading dot in lowercase
 */
export function getCleanExtension(filename) {
  const ext = path.extname(filename || "").toLowerCase().replace(/^\./, "");
  return ext;
}

/**
 * Verify whether path resolves safely strictly within the upload sandbox
 */
export function isPathInsideUploadDir(targetPath) {
  const resolved = path.resolve(targetPath);
  const sandbox = path.resolve(UPLOAD_DIR);
  return resolved.startsWith(sandbox + path.sep) || resolved === sandbox;
}

/**
 * Generate a unique filename if collision occurs
 */
export function resolveDuplicateName(targetDir, baseName, ext, strategy = "auto-rename") {
  const safeBase = sanitizeBaseName(baseName);
  const dotExt = ext ? `.${ext.toLowerCase()}` : "";
  const initialName = `${safeBase}${dotExt}`;
  const initialPath = path.join(targetDir, initialName);

  if (strategy === "overwrite" || !fs.existsSync(initialPath)) {
    return initialName;
  }

  // Auto-rename with (1), (2), etc.
  let counter = 1;
  while (true) {
    const candidateName = `${safeBase} (${counter})${dotExt}`;
    const candidatePath = path.join(targetDir, candidateName);
    if (!fs.existsSync(candidatePath)) {
      return candidateName;
    }
    counter++;
  }
}

/**
 * Custom multipart/form-data parser for Next.js API Routes (Node.js buffer based)
 */
export async function parseMultipartFormData(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return reject(new Error("Invalid Content-Type. Expected multipart/form-data"));
    }

    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!boundaryMatch) {
      return reject(new Error("Boundary not found in Content-Type header"));
    }
    const boundary = boundaryMatch[1] || boundaryMatch[2];
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks);
        const boundaryBuffer = Buffer.from(`--${boundary}`);

        const fields = {};
        const files = [];

        let start = 0;
        while (start < buffer.length) {
          const boundaryIndex = buffer.indexOf(boundaryBuffer, start);
          if (boundaryIndex === -1) break;

          const nextBoundaryIndex = buffer.indexOf(boundaryBuffer, boundaryIndex + boundaryBuffer.length);
          if (nextBoundaryIndex === -1) break;

          // Extract current part
          const partBuffer = buffer.subarray(boundaryIndex + boundaryBuffer.length, nextBoundaryIndex);
          
          // Header / Body separator is \r\n\r\n (or \n\n)
          let headerEndIndex = partBuffer.indexOf(Buffer.from("\r\n\r\n"));
          let headerLength = 4;
          if (headerEndIndex === -1) {
            headerEndIndex = partBuffer.indexOf(Buffer.from("\n\n"));
            headerLength = 2;
          }

          if (headerEndIndex !== -1) {
            const headerStr = partBuffer.subarray(0, headerEndIndex).toString("utf-8");
            let bodyBuffer = partBuffer.subarray(headerEndIndex + headerLength);

            // Trim leading/trailing CRLF before the boundary
            if (bodyBuffer.length >= 2 && bodyBuffer[bodyBuffer.length - 2] === 0x0D && bodyBuffer[bodyBuffer.length - 1] === 0x0A) {
              bodyBuffer = bodyBuffer.subarray(0, bodyBuffer.length - 2);
            } else if (bodyBuffer.length >= 1 && bodyBuffer[bodyBuffer.length - 1] === 0x0A) {
              bodyBuffer = bodyBuffer.subarray(0, bodyBuffer.length - 1);
            }

            // Parse headers
            const contentDispositionMatch = headerStr.match(/Content-Disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]+)")?/i);
            const contentTypeMatch = headerStr.match(/Content-Type:\s*([^\r\n;]+)/i);

            if (contentDispositionMatch) {
              const fieldName = contentDispositionMatch[1];
              const originalFilename = contentDispositionMatch[2];
              const mimeType = contentTypeMatch ? contentTypeMatch[1].trim() : "application/octet-stream";

              if (originalFilename !== undefined) {
                // It's a file
                files.push({
                  fieldName,
                  originalFilename,
                  mimeType,
                  buffer: bodyBuffer,
                  size: bodyBuffer.length,
                });
              } else {
                // It's a regular field
                fields[fieldName] = bodyBuffer.toString("utf-8").trim();
              }
            }
          }

          start = nextBoundaryIndex;
        }

        resolve({ fields, files });
      } catch (err) {
        reject(err);
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}
