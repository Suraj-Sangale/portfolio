import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  FileCheck,
  File as FileGeneric,
  Trash2,
  Download,
  Edit3,
  Copy,
  Check,
  ExternalLink,
  Search,
  HardDrive,
  FolderOpen,
  RefreshCw,
  AlertCircle,
  X,
  Sparkles,
  Cloud,
  QrCode,
} from "lucide-react";

// Allowed extensions list for display
const ALLOWED_EXT_LABELS = [
  "PDF",
  "DOCX",
  "XLSX",
  "PPTX",
  "TXT",
  "CSV",
  "MD",
  "JSON",
  "PNG",
  "JPG",
  "WEBP",
  "ZIP",
];

// Helper to determine file icon and color theme
function getFileIconInfo(extension) {
  const ext = (extension || "").toLowerCase();
  switch (ext) {
    case "pdf":
      return {
        icon: FileText,
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.12)",
        border: "rgba(239, 68, 68, 0.25)",
        label: "PDF",
      };
    case "doc":
    case "docx":
    case "rtf":
      return {
        icon: FileText,
        color: "#3b82f6",
        bg: "rgba(59, 130, 246, 0.12)",
        border: "rgba(59, 130, 246, 0.25)",
        label: "Word",
      };
    case "xls":
    case "xlsx":
    case "csv":
      return {
        icon: FileSpreadsheet,
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.12)",
        border: "rgba(16, 185, 129, 0.25)",
        label: "Sheet",
      };
    case "ppt":
    case "pptx":
      return {
        icon: FileText,
        color: "#f97316",
        bg: "rgba(249, 115, 22, 0.12)",
        border: "rgba(249, 115, 22, 0.25)",
        label: "Slides",
      };
    case "json":
    case "md":
    case "txt":
      return {
        icon: FileCode,
        color: "#eab308",
        bg: "rgba(234, 179, 8, 0.12)",
        border: "rgba(234, 179, 8, 0.25)",
        label: ext.toUpperCase(),
      };
    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "gif":
    case "svg":
      return {
        icon: ImageIcon,
        color: "#a855f7",
        bg: "rgba(168, 85, 247, 0.12)",
        border: "rgba(168, 85, 247, 0.25)",
        label: "Image",
      };
    case "zip":
    case "tar":
    case "gz":
    case "7z":
    case "rar":
      return {
        icon: FileArchive,
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.12)",
        border: "rgba(245, 158, 11, 0.25)",
        label: "Archive",
      };
    default:
      return {
        icon: FileGeneric,
        color: "#94a3b8",
        bg: "rgba(148, 163, 184, 0.12)",
        border: "rgba(148, 163, 184, 0.25)",
        label: ext ? ext.toUpperCase() : "File",
      };
  }
}

// Format bytes
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Relative time formatter
function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DocumentUploadSection() {
  // Staged file state (before upload)
  const [stagedFile, setStagedFile] = useState(null);
  const [customBaseName, setCustomBaseName] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [conflictStrategy, setConflictStrategy] = useState("auto-rename");
  const [isDragging, setIsDragging] = useState(false);

  // Upload status state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Document list state
  const [documents, setDocuments] = useState([]);
  const [storageProvider, setStorageProvider] = useState("supabase");
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedUrl, setCopiedUrl] = useState("");

  // Modals state
  const [renameModalDoc, setRenameModalDoc] = useState(null);
  const [newRenameBase, setNewRenameBase] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState("");

  const [deleteModalDoc, setDeleteModalDoc] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // QR Modal state
  const [qrModalDoc, setQrModalDoc] = useState(null);
  const [isQrClosing, setIsQrClosing] = useState(false);
  const [isQrMounted, setIsQrMounted] = useState(false);
  const [isDownloadingQr, setIsDownloadingQr] = useState(false);

  // Open QR modal with smooth bottom-to-top entry
  const openQrModal = (doc) => {
    setQrModalDoc(doc);
    setIsQrClosing(false);
    setIsQrMounted(false);
    // Trigger animation in next tick
    setTimeout(() => {
      setIsQrMounted(true);
    }, 15);
  };

  // Close QR modal with smooth top-to-bottom exit
  const handleCloseQrModal = () => {
    setIsQrClosing(true);
    setTimeout(() => {
      setQrModalDoc(null);
      setIsQrClosing(false);
      setIsQrMounted(false);
    }, 550);
  };

  // Toast notification
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch document list
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoadingDocs(true);
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents || []);
        if (data.storageProvider) {
          setStorageProvider(data.storageProvider);
        }
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Handle file selection from drop or picker
  const handleSelectFile = (file) => {
    if (!file) return;

    // Reset previous states
    setUploadError("");
    setUploadSuccess(false);
    setUploadProgress(0);

    // Extract filename and extension
    const lastDotIndex = file.name.lastIndexOf(".");
    let base = file.name;
    let ext = "";

    if (lastDotIndex > 0) {
      base = file.name.substring(0, lastDotIndex);
      ext = file.name.substring(lastDotIndex + 1).toLowerCase();
    }

    setStagedFile(file);
    setCustomBaseName(base);
    setFileExtension(ext);
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  // Perform upload via XMLHttpRequest for real upload progress
  const handleUpload = async () => {
    if (!stagedFile) return;

    if (!customBaseName.trim()) {
      setUploadError("Please provide a valid file name.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", stagedFile);
    formData.append("customName", customBaseName.trim());
    formData.append("conflictStrategy", conflictStrategy);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      setIsUploading(false);
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.success) {
          setUploadSuccess(true);
          showToast(`"${res.document.name}" uploaded successfully!`, "success");
          fetchDocuments();
          // Clear staged file after brief moment
          setTimeout(() => {
            setStagedFile(null);
            setCustomBaseName("");
            setFileExtension("");
            setUploadSuccess(false);
            setUploadProgress(0);
          }, 2000);
        } else {
          setUploadError(res.error || "Failed to upload file.");
        }
      } catch (err) {
        setUploadError("Unexpected server response.");
      }
    });

    xhr.addEventListener("error", () => {
      setIsUploading(false);
      setUploadError("Network error occurred during upload.");
    });

    xhr.open("POST", "/api/documents");
    xhr.send(formData);
  };

  // Cancel staged file
  const handleCancelStaging = () => {
    setStagedFile(null);
    setCustomBaseName("");
    setFileExtension("");
    setUploadError("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger Rename Modal
  const openRenameModal = (doc) => {
    setRenameModalDoc(doc);
    const lastDot = doc.name.lastIndexOf(".");
    const base = lastDot > 0 ? doc.name.substring(0, lastDot) : doc.name;
    setNewRenameBase(base);
    setRenameError("");
  };

  // Execute Rename
  const handleExecuteRename = async () => {
    if (!renameModalDoc || !newRenameBase.trim()) {
      setRenameError("Please enter a valid file name.");
      return;
    }

    try {
      setIsRenaming(true);
      setRenameError("");

      const res = await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldName: renameModalDoc.name,
          newName: newRenameBase.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Renamed to "${data.name}"`, "success");
        setRenameModalDoc(null);
        fetchDocuments();
      } else {
        setRenameError(data.error || "Failed to rename document.");
      }
    } catch (err) {
      setRenameError("Error connecting to the server.");
    } finally {
      setIsRenaming(false);
    }
  };

  // Execute Delete
  const handleExecuteDelete = async () => {
    if (!deleteModalDoc) return;

    try {
      setIsDeleting(true);
      const res = await fetch(
        `/api/documents?name=${encodeURIComponent(deleteModalDoc.name)}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`"${deleteModalDoc.name}" has been deleted.`, "success");
        setDeleteModalDoc(null);
        fetchDocuments();
      } else {
        showToast(data.error || "Failed to delete file.", "error");
      }
    } catch (err) {
      showToast("Error deleting document.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = (doc) => {
    const fullUrl = doc.url?.startsWith("http")
      ? doc.url
      : `${window.location.origin}${doc.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(doc.name);
    showToast("Direct link copied to clipboard!", "success");
    setTimeout(() => {
      setCopiedUrl("");
    }, 2500);
  };

  // Download QR Code image
  const handleDownloadQr = async (doc) => {
    if (!doc) return;
    try {
      setIsDownloadingQr(true);
      const fullUrl = doc.url?.startsWith("http")
        ? doc.url
        : `${window.location.origin}${doc.url}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=20&data=${encodeURIComponent(
        fullUrl
      )}`;
      const res = await fetch(qrApiUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${doc.name}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      showToast("QR code image downloaded successfully!", "success");
    } catch (err) {
      console.error("QR download failed:", err);
      showToast("Failed to download QR code image.", "error");
    } finally {
      setIsDownloadingQr(false);
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategory === "all") return true;
    const ext = (doc.extension || "").toLowerCase();

    if (selectedCategory === "pdf") return ext === "pdf";
    if (selectedCategory === "docs")
      return ["doc", "docx", "txt", "rtf", "md"].includes(ext);
    if (selectedCategory === "sheets")
      return ["xls", "xlsx", "csv"].includes(ext);
    if (selectedCategory === "images")
      return ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext);
    if (selectedCategory === "archives")
      return ["zip", "tar", "gz", "7z", "rar"].includes(ext);
    return true;
  });

  // Calculate stats
  const totalStorageBytes = documents.reduce(
    (acc, doc) => acc + (doc.size || 0),
    0,
  );
  const totalStorageFormatted = formatFileSize(totalStorageBytes);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 text-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl backdrop-blur-xl border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
              : "bg-rose-950/80 border-rose-500/30 text-rose-200"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-75 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase mb-3">
            {storageProvider === "supabase" ? (
              <>
                <Cloud className="w-3.5 h-3.5" />
                <span>Supabase Cloud Storage</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Local Storage</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Document Center
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl">
            Upload, rename, manage, and store documents securely in cloud
            storage with instant CDN access and public sharing links.
          </p>
        </div>

        {/* Storage Stats Bar */}
        <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 backdrop-blur-md px-5 py-3.5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">
                Files Stored
              </div>
              <div className="text-lg font-bold text-white">
                {documents.length}
              </div>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-mono">
                Used Space
              </div>
              <div className="text-lg font-bold text-white">
                {totalStorageFormatted}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── UPLOAD SECTION ─────────────────────────────────────────────────── */}
      <div className="mb-12">
        {!stagedFile ? (
          /* Dropzone Area */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center overflow-hidden ${
              isDragging
                ? "border-emerald-400 bg-emerald-950/20 scale-[1.01] shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                : "border-slate-800 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-900/60"
            }`}
          >
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-emerald-500/5 opacity-50 pointer-events-none" />

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleSelectFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-lg ${
                  isDragging
                    ? "bg-emerald-500 text-slate-950 scale-110"
                    : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                }`}
              >
                <UploadCloud className="w-10 h-10" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Drag & drop your document here
              </h3>
              <p className="text-sm text-slate-400 mb-6 max-w-md">
                or{" "}
                <span className="text-emerald-400 font-medium underline underline-offset-4">
                  click to browse
                </span>{" "}
                from your device. You can customize the file name before
                uploading.
              </p>

              {/* Supported formats pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl">
                {ALLOWED_EXT_LABELS.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60"
                  >
                    .{tag.toLowerCase()}
                  </span>
                ))}
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40">
                  Max 25 MB
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Staging / Pre-Upload Card */
          <div className="relative bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Ambient Accent Line */}
            <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500 rounded-full" />

            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    File Staged for Upload
                  </h3>
                  <p className="text-xs text-slate-400">
                    Original:{" "}
                    <span className="font-mono text-slate-300">
                      {stagedFile.name}
                    </span>{" "}
                    ({formatFileSize(stagedFile.size)})
                  </p>
                </div>
              </div>

              <button
                onClick={handleCancelStaging}
                disabled={isUploading}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Renaming Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* Rename Input */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Target File Name (Auto-Preserves Extension)
                </label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 focus-within:border-emerald-400 transition-colors overflow-hidden">
                  <input
                    type="text"
                    value={customBaseName}
                    onChange={(e) => setCustomBaseName(e.target.value)}
                    disabled={isUploading}
                    placeholder="Enter custom file name"
                    className="w-full bg-transparent px-4 py-3 text-sm text-white focus:outline-none font-medium placeholder-slate-600"
                  />
                  {fileExtension && (
                    <div className="bg-slate-800 px-3.5 py-3 text-xs font-mono font-bold text-emerald-400 border-l border-slate-700 select-none">
                      .{fileExtension}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 font-mono">
                  Cloud destination:{" "}
                  <span className="text-slate-400">
                    documents/{customBaseName.trim() || "document"}.
                    {fileExtension}
                  </span>
                </p>
              </div>

              {/* Conflict Resolution Strategy */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  If Name Already Exists
                </label>
                <select
                  value={conflictStrategy}
                  onChange={(e) => setConflictStrategy(e.target.value)}
                  disabled={isUploading}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-400 transition-colors"
                >
                  <option value="auto-rename">
                    Auto-rename (add suffix like (1))
                  </option>
                  <option value="overwrite">Overwrite existing file</option>
                  <option value="reject">Reject upload on duplicate</option>
                </select>
              </div>
            </div>

            {/* Error Display */}
            {uploadError && (
              <div className="flex items-center gap-3 p-3.5 mb-5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Uploading to Cloud Storage...</span>
                  <span className="text-emerald-400 font-bold">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-emerald-500 transition-all duration-200 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Success State */}
            {uploadSuccess && (
              <div className="flex items-center gap-3 p-3.5 mb-5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-sm">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Document saved successfully in Cloud Storage!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleCancelStaging}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || uploadSuccess}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── DOCUMENT GALLERY & MANAGER ─────────────────────────────────────── */}
      <div>
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Stored Documents</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {filteredDocuments.length}
              </span>
            </h2>
            <button
              onClick={fetchDocuments}
              disabled={isLoadingDocs}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh document list"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoadingDocs ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full bg-slate-900/80 border border-slate-800 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              {["all", "pdf", "docs", "sheets", "images", "archives"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      selectedCategory === cat
                        ? "bg-slate-700 text-white font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Document Cards Grid */}
        {isLoadingDocs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-36 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/30 border border-slate-800/80">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-1">
              {searchQuery || selectedCategory !== "all"
                ? "No matching documents found"
                : "No documents uploaded yet"}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search query or filter tags."
                : "Drop your files into the box above to store your first document in cloud storage."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => {
              const iconInfo = getFileIconInfo(doc.extension);
              const IconComp = iconInfo.icon;

              const ext = doc.extension?.toLowerCase();
              const isImage = [
                "png",
                "jpg",
                "jpeg",
                "gif",
                "webp",
                "svg",
                "avif",
              ].includes(ext);
              const isPdf = ext === "pdf";
              const isVideo = ["mp4", "webm", "mov"].includes(ext);
              const hasPreview = isImage || isPdf || isVideo;

              return (
                <div
                  key={doc.name}
                  className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  {/* Preview area */}
                  <div className="relative w-full h-32 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-center overflow-hidden">
                    {isImage && (
                      <img
                        src={doc.url}
                        alt={doc.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextSibling.style.display = "flex";
                        }}
                      />
                    )}

                    {isPdf && (
                      <iframe
                        src={`${doc.url}#toolbar=0&navpanes=0&view=FitH`}
                        title={doc.name}
                        className="w-full h-full pointer-events-none scale-105"
                      />
                    )}

                    {isVideo && (
                      <video
                        src={doc.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    )}

                    {/* Fallback icon (also shown if image fails to load) */}
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ display: hasPreview ? "none" : "flex" }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: iconInfo.bg,
                          border: `1px solid ${iconInfo.border}`,
                          color: iconInfo.color,
                        }}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Type badge overlay */}
                    <span
                      className="absolute top-2 left-2 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md backdrop-blur-sm"
                      style={{
                        background: iconInfo.bg,
                        color: iconInfo.color,
                        border: `1px solid ${iconInfo.border}`,
                      }}
                    >
                      {iconInfo.label}
                    </span>

                    {/* Copy link overlay */}
                    <button
                      onClick={() => handleCopyLink(doc)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/60 backdrop-blur-sm text-slate-300 hover:text-slate-100 hover:bg-slate-900 transition-colors"
                      title="Copy direct link"
                    >
                      {copiedUrl === doc.name ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      {/* File Name */}
                      <h4
                        className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 break-all mb-1.5"
                        title={doc.name}
                      >
                        {doc.name}
                      </h4>

                      {/* Metadata */}
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span>{doc.formattedSize}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(doc.modifiedAt)}</span>
                      </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center justify-between gap-2 mt-5 pt-3.5 border-t border-slate-800/80">
                      <div className="flex items-center gap-1">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Open / Preview in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <a
                          href={doc.url}
                          download={doc.name}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => openRenameModal(doc)}
                          className="p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-950/40 transition-colors"
                          title="Rename document"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openQrModal(doc)}
                          className="p-2 rounded-xl text-slate-400 hover:text-purple-400 hover:bg-purple-950/40 transition-colors"
                          title="Get QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => setDeleteModalDoc(doc)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── RENAME MODAL ───────────────────────────────────────────────────── */}
      {renameModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Rename Document
                </h3>
              </div>
              <button
                onClick={() => setRenameModalDoc(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Original name:{" "}
              <span className="font-mono text-slate-300">
                {renameModalDoc.name}
              </span>
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
                New Name (Extension Locked)
              </label>
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 focus-within:border-blue-400 transition-colors overflow-hidden">
                <input
                  type="text"
                  value={newRenameBase}
                  onChange={(e) => setNewRenameBase(e.target.value)}
                  placeholder="Enter new file name"
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-white focus:outline-none font-medium"
                  autoFocus
                />
                {renameModalDoc.extension && (
                  <div className="bg-slate-800 px-3 py-2.5 text-xs font-mono font-bold text-blue-400 border-l border-slate-700 select-none">
                    .{renameModalDoc.extension}
                  </div>
                )}
              </div>
            </div>

            {renameError && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{renameError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setRenameModalDoc(null)}
                disabled={isRenaming}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRename}
                disabled={isRenaming || !newRenameBase.trim()}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isRenaming ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ──────────────────────────────────────── */}
      {deleteModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Document?</h3>
            </div>

            <p className="text-sm text-slate-300 mb-2">
              Are you sure you want to permanently delete:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 break-all mb-4">
              {deleteModalDoc.name}
            </div>
            <p className="text-xs text-rose-400/80 mb-6">
              This will permanently delete the file from storage. This action
              cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeleteModalDoc(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete File</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── QR CODE MODAL ─────────────────────────────────────────────────── */}
      {qrModalDoc && (
        <div
          onClick={handleCloseQrModal}
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity duration-500 ease-out ${
            isQrMounted && !isQrClosing ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-full sm:max-w-md bg-slate-900 border-t sm:border border-slate-700/90 rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center transform transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] max-h-[90vh] overflow-y-auto ${
              isQrMounted && !isQrClosing
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-full sm:translate-y-16 opacity-0 sm:scale-95"
            }`}
          >
            {/* Mobile swipe/drag indicator bar */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden flex-shrink-0" />

            {/* Ambient accent top border */}
            <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-500 rounded-full hidden sm:block" />

            {/* Header */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-left">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Document QR Code
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Scan to view or download
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseQrModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code Container with High Contrast & Glow */}
            <div className="relative group p-4 bg-white rounded-2xl shadow-xl shadow-purple-500/10 border-4 border-slate-800 my-2 transition-transform duration-300 hover:scale-[1.02]">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(
                  qrModalDoc.url?.startsWith("http")
                    ? qrModalDoc.url
                    : typeof window !== "undefined"
                    ? `${window.location.origin}${qrModalDoc.url}`
                    : qrModalDoc.url
                )}`}
                alt={`QR code for ${qrModalDoc.name}`}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain block"
                loading="eager"
              />
            </div>

            {/* File Info */}
            <div className="w-full my-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left">
              <p
                className="text-xs font-semibold text-slate-200 truncate mb-1"
                title={qrModalDoc.name}
              >
                {qrModalDoc.name}
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{qrModalDoc.formattedSize || "File"}</span>
                <span className="text-emerald-400 uppercase font-bold">
                  {qrModalDoc.extension || "PDF"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleDownloadQr(qrModalDoc)}
                disabled={isDownloadingQr}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all active:scale-95 disabled:opacity-50"
              >
                {isDownloadingQr ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download QR</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopyLink(qrModalDoc)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
