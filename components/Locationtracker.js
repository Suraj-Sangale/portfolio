import { useState, useEffect } from "react";

const globalStyles = `
@keyframes ping {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

function MapIllustration() {
  return (
    <svg width="100%" height="160" viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg">
      <rect width="420" height="160" fill="#e8e0d8" />
      <rect x="0" y="68" width="420" height="24" fill="#fff" opacity="0.9" />
      <rect x="180" y="0" width="22" height="160" fill="#fff" opacity="0.9" />
      <rect x="290" y="0" width="16" height="160" fill="#fff" opacity="0.85" />
      <rect x="70" y="0" width="14" height="160" fill="#fff" opacity="0.8" />
      <rect x="0" y="120" width="420" height="14" fill="#fff" opacity="0.8" />
      <rect x="0" y="30" width="420" height="12" fill="#fff" opacity="0.75" />
      <rect x="300" y="10" width="90" height="55" rx="6" fill="#a8d5a2" opacity="0.8" />
      <rect x="320" y="72" width="60" height="40" rx="4" fill="#b8ddb0" opacity="0.7" />
      <path d="M0,45 Q40,50 80,42 Q120,34 160,46 Q180,52 200,48" stroke="#7ec8e3" strokeWidth="14" fill="none" opacity="0.7" />
      <rect x="90" y="10" width="70" height="55" rx="3" fill="#d0c8be" opacity="0.9" />
      <rect x="220" y="95" width="55" height="22" rx="2" fill="#c8c0b5" opacity="0.8" />
      <rect x="10" y="95" width="50" height="22" rx="2" fill="#d0c8be" opacity="0.8" />
      <rect x="10" y="10" width="48" height="16" rx="2" fill="#c8c0b5" opacity="0.7" />
      <g transform="translate(202, 58)">
        <circle cx="0" cy="0" r="18" fill="rgba(239,68,68,0.18)" />
        <circle cx="0" cy="0" r="11" fill="#ef4444" />
        <circle cx="0" cy="0" r="5" fill="white" />
        <line x1="0" y1="11" x2="0" y2="22" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// popupStatus: "idle" | "loading" | "error"
function LocationPopup({ onSkip, onEnable, popupStatus, popupError }) {
  const isLoading = popupStatus === "loading";
  const isError = popupStatus === "error";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(4px)",
      animation: "overlayIn 0.25s ease",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px",
        width: "100%", maxWidth: "380px", overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        {/* Map */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <MapIllustration />
          {!isLoading && (
            <button onClick={onSkip} style={{
              position: "absolute", top: "12px", right: "12px",
              width: "30px", height: "30px",
              background: "rgba(0,0,0,0.45)", border: "none", borderRadius: "50%",
              color: "#fff", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          )}
          {isLoading && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(255,255,255,0.65)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: "40px", height: "40px",
                border: "3px solid #e5e7eb", borderTopColor: "#0ea5e9",
                borderRadius: "50%", animation: "spin 0.8s linear infinite",
              }} />
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px 28px" }}>
          <h2 style={{
            margin: "0 0 10px", fontSize: "20px", fontWeight: "700",
            color: "#1a1a2e", textAlign: "center",
          }}>
            {isLoading ? "Locating you\u2026" : "Location Access"}
          </h2>

          {isError ? (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              background: "#fff5f5", border: "1px solid #fecaca",
              borderRadius: "10px", padding: "12px 14px",
              marginBottom: "18px", animation: "fadeUp 0.3s ease",
            }}>
              <span style={{ fontSize: "15px", flexShrink: 0 }}>⚠️</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#dc2626", marginBottom: "2px" }}>
                  Couldn't get your location
                </div>
                <div style={{ fontSize: "12px", color: "#b91c1c", lineHeight: 1.5 }}>
                  {popupError || "Location access was denied or unavailable. Please enable it in your device settings and try again."}
                </div>
              </div>
            </div>
          ) : (
            <p style={{
              margin: "0 0 22px", fontSize: "14px",
              color: isLoading ? "#9ca3af" : "#6b7280",
              textAlign: "center", lineHeight: 1.5,
            }}>
              {isLoading
                ? "Please wait while we acquire your coordinates\u2026"
                : "Enable location access to get your precise coordinates and find nearby places."}
            </p>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={onSkip}
              disabled={isLoading}
              style={{
                flex: 1, padding: "13px",
                background: "#fff", border: "1.5px solid #e5e7eb",
                borderRadius: "50px", fontSize: "15px", fontWeight: "500",
                color: isLoading ? "#d1d5db" : "#374151",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.15s", fontFamily: "inherit",
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#d1d5db"; }}}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
            >Skip</button>

            <button
              onClick={onEnable}
              disabled={isLoading}
              style={{
                flex: 1.6, padding: "13px",
                background: isLoading
                  ? "linear-gradient(135deg, #7dd3c8, #7ec8e8)"
                  : "linear-gradient(135deg, #14b8a6, #0ea5e9)",
                border: "none", borderRadius: "50px",
                fontSize: "15px", fontWeight: "600", color: "#fff",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.15s", fontFamily: "inherit",
                boxShadow: isLoading ? "none" : "0 4px 14px rgba(14,165,233,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.boxShadow = "0 6px 20px rgba(14,165,233,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.boxShadow = "0 4px 14px rgba(14,165,233,0.35)"; e.currentTarget.style.transform = "none"; }}}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: "14px", height: "14px",
                    border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff",
                    borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0,
                  }} />
                  Locating\u2026
                </>
              ) : isError ? "Try Again" : "Enable Location"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LocationTracker() {
  const [status, setStatus] = useState("idle");
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState("idle");
  const [popupError, setPopupError] = useState(null);

  // Called from inside the popup (on "Enable Location" / "Try Again")
  // Never closes or re-opens the popup — stays open until success
  const requestLocationViaPopup = () => {
    setPopupStatus("loading");
    setPopupError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          altitude: position.coords.altitude,
        });
        setAccuracy(position.coords.accuracy);
        setStatus("success");
        // Only close popup on success
        setShowPopup(false);
        setPopupStatus("idle");
      },
      (err) => {
        // Show error inside popup — do NOT close or reopen
        setPopupStatus("error");
        setPopupError(err.message || "Could not access your location.");
        setStatus("idle");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Initial trigger from the main "Get My Location" button
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setCoords(null);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          altitude: position.coords.altitude,
        });
        setAccuracy(position.coords.accuracy);
        setStatus("success");
      },
      (err) => {
        if (err.code === 1 || err.code === 2) {
          // Open popup once — subsequent retries happen inside popup
          setShowPopup(true);
          setPopupStatus("idle");
          setPopupError(null);
          setStatus("idle");
        } else {
          setError(err.message);
          setStatus("error");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Auto-fetch location on page load
  useEffect(() => { getLocation(); }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <style>{globalStyles}</style>

      {showPopup && (
        <LocationPopup
          popupStatus={popupStatus}
          popupError={popupError}
          onSkip={() => { setShowPopup(false); setPopupStatus("idle"); setPopupError(null); }}
          onEnable={requestLocationViaPopup}
        />
      )}

      <div style={{
        minHeight: "100vh", background: "#060a0f",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Courier New', monospace", padding: "24px",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <div style={{ marginBottom: "32px", textAlign: "center" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.3em", color: "#2eff9e", textTransform: "uppercase", marginBottom: "8px" }}>
              ◈ GEO LOCATOR v1.0
            </div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#e8f0fe", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              COORDINATE<br />
              <span style={{
                background: "linear-gradient(90deg, #2eff9e, #00c8ff, #2eff9e)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "shimmer 3s linear infinite",
              }}>FINDER</span>
            </h1>
          </div>

          <div style={{
            background: "#0d1117", border: "1px solid #1e2a38",
            borderRadius: "16px", padding: "28px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0, width: "80px", height: "80px",
              background: "radial-gradient(circle at top right, rgba(46,255,158,0.08), transparent 70%)",
              borderRadius: "0 16px 0 0",
            }} />

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <div style={{ position: "relative", width: "10px", height: "10px" }}>
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: status === "success" ? "#2eff9e" : status === "error" ? "#ff4d6d" : status === "loading" ? "#00c8ff" : "#3a4a5c",
                  ...(status === "success" || status === "loading" ? { animation: "ping 1.5s ease-out infinite" } : {}),
                }} />
                <div style={{
                  position: "absolute", inset: "1px", borderRadius: "50%",
                  background: status === "success" ? "#2eff9e" : status === "error" ? "#ff4d6d" : status === "loading" ? "#00c8ff" : "#3a4a5c",
                }} />
              </div>
              <span style={{
                fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
                color: status === "success" ? "#2eff9e" : status === "error" ? "#ff4d6d" : status === "loading" ? "#00c8ff" : "#4a5a6c",
              }}>
                {status === "idle" && "Ready to acquire signal"}
                {status === "loading" && "Acquiring signal..."}
                {status === "success" && "Signal acquired"}
                {status === "error" && "Signal failed"}
              </span>
            </div>

            {status === "success" && coords && (
              <div style={{ animation: "fadeUp 0.4s ease", marginBottom: "24px" }}>
                {[
                  { label: "LATITUDE", value: coords.lat.toFixed(7), color: "#2eff9e" },
                  { label: "LONGITUDE", value: coords.lng.toFixed(7), color: "#00c8ff" },
                  ...(coords.altitude !== null ? [{ label: "ALTITUDE", value: `${coords.altitude?.toFixed(1) ?? "N/A"} m`, color: "#b794f4" }] : []),
                  { label: "ACCURACY", value: `\u00b1${accuracy?.toFixed(0)} m`, color: "#ffa94d" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0", borderBottom: "1px solid #1a2332",
                  }}>
                    <span style={{ fontSize: "10px", color: "#4a6070", letterSpacing: "0.15em" }}>{label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "15px", color, fontWeight: "600", letterSpacing: "0.05em" }}>{value}</span>
                      <button
                        onClick={() => copyToClipboard(value)}
                        style={{
                          background: "none", border: "1px solid #1e2a38",
                          borderRadius: "4px", padding: "2px 6px", cursor: "pointer",
                          color: "#4a6070", fontSize: "9px", letterSpacing: "0.1em", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.target.style.borderColor = color; e.target.style.color = color; }}
                        onMouseLeave={e => { e.target.style.borderColor = "#1e2a38"; e.target.style.color = "#4a6070"; }}
                      >COPY</button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => copyToClipboard(`${coords.lat}, ${coords.lng}`)}
                  style={{
                    marginTop: "16px", width: "100%",
                    background: "transparent", border: "1px dashed #2eff9e33",
                    borderRadius: "8px", padding: "10px",
                    color: "#2eff9e99", fontSize: "11px", letterSpacing: "0.15em",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#2eff9e11"; e.currentTarget.style.borderColor = "#2eff9e66"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#2eff9e33"; }}
                >\u2318 COPY FULL COORDINATES</button>
              </div>
            )}

            {status === "error" && (
              <div style={{
                background: "#1a0a0e", border: "1px solid #3a1020",
                borderRadius: "8px", padding: "14px",
                marginBottom: "24px", animation: "fadeUp 0.4s ease",
              }}>
                <div style={{ fontSize: "10px", color: "#ff4d6d", letterSpacing: "0.1em", marginBottom: "4px" }}>ERROR</div>
                <div style={{ fontSize: "13px", color: "#c0a0a8" }}>{error}</div>
              </div>
            )}

            {status === "loading" && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                <div style={{
                  width: "36px", height: "36px",
                  border: "2px solid #1e2a38", borderTopColor: "#00c8ff",
                  borderRadius: "50%", animation: "spin 0.8s linear infinite",
                }} />
              </div>
            )}

            <button
              onClick={getLocation}
              disabled={status === "loading"}
              style={{
                width: "100%", padding: "14px",
                background: status === "loading" ? "#0d1117" : "linear-gradient(135deg, #0a2a1e, #0d1f30)",
                border: `1px solid ${status === "loading" ? "#1e2a38" : "#2eff9e44"}`,
                borderRadius: "10px",
                color: status === "loading" ? "#2a3a4a" : "#2eff9e",
                fontSize: "12px", letterSpacing: "0.2em",
                fontFamily: "inherit", fontWeight: "700",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                transition: "all 0.2s", textTransform: "uppercase",
              }}
              onMouseEnter={e => {
                if (status !== "loading") {
                  e.currentTarget.style.background = "linear-gradient(135deg, #0d3324, #102840)";
                  e.currentTarget.style.borderColor = "#2eff9e88";
                  e.currentTarget.style.boxShadow = "0 0 20px #2eff9e22";
                }
              }}
              onMouseLeave={e => {
                if (status !== "loading") {
                  e.currentTarget.style.background = "linear-gradient(135deg, #0a2a1e, #0d1f30)";
                  e.currentTarget.style.borderColor = "#2eff9e44";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {status === "loading" ? "ACQUIRING..." : status === "success" ? "\u21ba REFRESH LOCATION" : "\u25ce GET MY LOCATION"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "10px", color: "#2a3a4c", letterSpacing: "0.1em" }}>
            USES BROWSER GEOLOCATION API \u00b7 PERMISSION REQUIRED
          </p>
        </div>
      </div>
    </>
  );
}