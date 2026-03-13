const ResumeModal = ({ show, onClose, resumeLink }) => {
  if (!show) return null;

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl h-[85vh] flex flex-col
        rounded-2xl overflow-hidden
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5
          border-b border-white/10
          bg-white/10 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              }}
            >
              SS
            </div>

            <div>
              <p className="text-sm font-medium text-white">Suraj Sangale</p>
              <p className="text-xs text-white/60">
                Resume · PDF · Updated March 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resumeLink}
              download
              className="px-4 py-1.5 rounded-lg text-xs text-white
            bg-indigo-500/90 hover:bg-indigo-500 transition"
            >
              Download PDF
            </a>
            <a
              href={resumeLink}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg
              border border-white/20
              bg-white/10 backdrop-blur
              flex items-center justify-center
              text-white/70 hover:bg-white/20 transition"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V9" />
                <path d="M10 2h4v4M14 2L8 8" />
              </svg>
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg
              border border-white/20
              bg-white/10 backdrop-blur
              flex items-center justify-center
              text-white/60 hover:bg-red-500/20 hover:text-red-300 transition"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-black/20 backdrop-blur-sm">
          <iframe
            src={resumeLink}
            title="Resume"
            className="w-full h-full"
            style={{ border: "none" }}
          />
        </div>
      </div>
    </>
  );
};

export default ResumeModal;
