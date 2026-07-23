import React, { useEffect, useRef, useState, useCallback } from "react";

// Animation durations in ms
const ENTER_MS = 800;
const EXIT_MS  = 800;

export default function CommonModal({
  modalOpen,
  setModalOpen,
  modalTitle = "",
  children,
  backDrop = false,
  handleBackButtonClick,
  showBackButton,
  modalSize = "w-11/12 md:w-[32%]",
  isDarkMode = false,
  bottomSheet = false,
}) {
  // "closed" | "opening" | "open" | "closing"
  const [state, setState] = useState("closed");
  const timerRef = useRef(null);

  // ── Open / Close orchestration ──────────────────────────────────────────
  useEffect(() => {
    if (modalOpen && (state === "closed" || state === "closing")) {
      clearTimeout(timerRef.current);
      setState("opening");
    }
  }, [modalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intercept close: run exit animation THEN update parent
  const requestClose = useCallback(() => {
    if (state === "closing" || state === "closed") return;
    clearTimeout(timerRef.current);
    setState("closing");
    timerRef.current = setTimeout(() => {
      setState("closed");
      setModalOpen(false);
    }, EXIT_MS);
  }, [state, setModalOpen]);

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop" && !backDrop) requestClose();
  };

  // Scroll lock
  useEffect(() => {
    const locked = state !== "closed";
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [state]);

  // ── Bottom-sheet variant ──────────────────────────────────────────────────
  if (bottomSheet) {
    const isClosing = state === "closing";
    const isVisible = state !== "closed";

    // ── Inline animation strings (changing the value always restarts animation)
    const mobileEnter = `slideUpSheet   ${ENTER_MS}ms cubic-bezier(0.32,0.72,0,1) both`;
    const mobileExit  = `slideDownSheet ${EXIT_MS}ms  cubic-bezier(0.55,0,1,0.45) both`;
    const desktopEnter = `zoomInModal  320ms cubic-bezier(0.22,1,0.36,1) both`;
    const desktopExit  = `zoomOutModal 280ms cubic-bezier(0.22,1,0.36,1) both`;
    const backdropEnter = `fadeInBackdrop  250ms ease both`;
    const backdropExit  = `fadeOutBackdrop 300ms ease both`;

    return (
      <>
        <style>{`
          @keyframes slideUpSheet {
            from { transform: translateY(100%); opacity: 0.6; }
            to   { transform: translateY(0);    opacity: 1;   }
          }
          @keyframes slideDownSheet {
            from { transform: translateY(0);    opacity: 1; }
            to   { transform: translateY(100%); opacity: 0; }
          }
          @keyframes zoomInModal {
            from { transform: scale(0.88) translateY(16px); opacity: 0; }
            to   { transform: scale(1)    translateY(0);    opacity: 1; }
          }
          @keyframes zoomOutModal {
            from { transform: scale(1)    translateY(0);    opacity: 1; }
            to   { transform: scale(0.88) translateY(16px); opacity: 0; }
          }
          @keyframes fadeInBackdrop  { from { opacity:0; } to { opacity:1; } }
          @keyframes fadeOutBackdrop { from { opacity:1; } to { opacity:0; } }

          /* ── Layout ── */
          .bs-wrapper-mobile {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: stretch;
            height: 100%;
          }
          .bs-panel-base {
            overflow-y: auto;
          }
          /* mobile panel shape */
          .bs-panel-mobile {
            border-radius: 20px 20px 0 0;
            max-height: 92vh;
            width: 100%;
          }
          /* desktop panel shape */
          @media (min-width: 768px) {
            .bs-panel-mobile {
              border-radius: 16px;
              max-height: 90vh;
              width: 75%;
              max-width: 1100px;
            }
          }
          @media (min-width: 1280px) {
            .bs-panel-mobile { width: 70%; }
          }

          /* ── Close button ── */
          .bs-close-btn {
            position: absolute;
            top: 56px;
            right: 16px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.25);
            color: #fff;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 102;
            transition: background 0.2s, transform 0.15s;
          }
          .bs-close-btn:hover {
            background: rgba(255,70,70,0.4);
            transform: scale(1.1);
          }
          @media (min-width: 768px) {
            .bs-close-btn {
              top: calc(5vh - 4px);
              right: calc(12.5% - 52px);
            }
          }
          @media (min-width: 1280px) {
            .bs-close-btn { right: calc(15% - 52px); }
          }
        `}</style>

        {isVisible && (
          <div
            id="modal-backdrop"
            onClick={handleBackdropClick}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 101,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              backgroundColor: "rgba(0,0,0,0.55)",
              // ── backdrop animation driven by inline style ──
              animation: isClosing ? backdropExit : backdropEnter,
            }}
          >
            {/* Desktop: center wrapper; Mobile: bottom wrapper */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "stretch",
                height: "100%",
                position: "relative",
              }}
              className="md:!flex-row md:!justify-center md:!items-center"
            >
              {/* Floating ✕ button */}
              {!backDrop && (
                <button
                  onClick={requestClose}
                  className="bs-close-btn"
                  aria-label="Close"
                >
                  ✕
                </button>
              )}

              {/* Panel — animation driven by inline style, so it ALWAYS restarts */}
              <div
                className={`bs-panel-base bs-panel-mobile ${modalSize}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  animation: isClosing
                    ? mobileExit   // will be overridden to zoomOut on desktop via JS below
                    : mobileEnter,
                }}
                ref={(el) => {
                  // Switch animation name for desktop at runtime
                  if (!el) return;
                  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
                  if (isDesktop) {
                    el.style.animation = isClosing ? desktopExit : desktopEnter;
                  }
                }}
              >
                {/* Drag handle — mobile only */}
                <div
                  className="block md:hidden"
                  style={{
                    width: "40px",
                    height: "4px",
                    borderRadius: "2px",
                    background: "rgba(255,255,255,0.3)",
                    margin: "10px auto 0",
                  }}
                />

                {/* Optional title */}
                {modalTitle && (
                  <div className="flex justify-between items-center p-4 border-b border-white/10 text-white">
                    <div className="text-lg font-semibold">{modalTitle}</div>
                    {showBackButton && handleBackButtonClick && (
                      <button onClick={handleBackButtonClick} className="text-white/60 hover:text-white">
                        &#8592;
                      </button>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-auto">
                  {React.cloneElement(children, { toggleModal: requestClose })}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Default centered modal ────────────────────────────────────────────────
  return (
    <>
      {modalOpen && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 z-[101] flex items-center justify-center backdrop-blur-sm bg-gray-900/30 p-5"
          onClick={handleBackdropClick}
        >
          <div
            className={`${!isDarkMode ? "bg-white" : ""} rounded-lg shadow-lg ${modalSize} mx-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {modalTitle && (
              <div className="flex justify-between items-center p-4 border-b text-black border-gray-200">
                <div className="text-lg font-semibold">{modalTitle}</div>
                {showBackButton && handleBackButtonClick && (
                  <button onClick={handleBackButtonClick} className="text-gray-600 hover:text-gray-900">
                    &#8592;
                  </button>
                )}
                {!backDrop && (
                  <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:text-gray-900 cursor-pointer">
                    &#10005;
                  </button>
                )}
              </div>
            )}
            <div className="flex-1 overflow-auto">
              {React.cloneElement(children, { toggleModal: () => setModalOpen(false) })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
