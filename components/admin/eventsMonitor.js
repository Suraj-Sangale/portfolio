import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

/* ─── constants ────────────────────────────────────────────────────────── */
const EVENT_COLORS = {
  portfolio_session_start: { bg: "#14290d", border: "#4ade80", dot: "#4ade80", label: "SESSION START" },
  portfolio_page_view:     { bg: "#0c1a3a", border: "#38bdf8", dot: "#38bdf8", label: "PAGE VIEW" },
  page_view:               { bg: "#0c1a3a", border: "#60a5fa", dot: "#60a5fa", label: "PAGE VIEW" },
  contact_form_submit:     { bg: "#1a0f2e", border: "#a78bfa", dot: "#a78bfa", label: "CONTACT" },
  project_view:            { bg: "#2d1206", border: "#fb923c", dot: "#fb923c", label: "PROJECT" },
  project_link_click:      { bg: "#2d1206", border: "#f97316", dot: "#f97316", label: "PROJ LINK" },
  resume_action:           { bg: "#0f1f2e", border: "#22d3ee", dot: "#22d3ee", label: "RESUME" },
  social_link_click:       { bg: "#1f0a1a", border: "#f472b6", dot: "#f472b6", label: "SOCIAL" },
  user_interaction:        { bg: "#1a1a2e", border: "#818cf8", dot: "#818cf8", label: "INTERACTION" },
  portfolio_page_activity: { bg: "#1a1a2e", border: "#a5b4fc", dot: "#a5b4fc", label: "ACTIVITY" },
  default:                 { bg: "#0f172a", border: "#334155", dot: "#64748b", label: "EVENT" },
};

function getStyle(eventName) {
  return EVENT_COLORS[eventName] || EVENT_COLORS.default;
}

function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch { return "—"; }
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString([], { dateStyle: "short", timeStyle: "short" });
  } catch { return "—"; }
}

/* ─── Live Event Row ───────────────────────────────────────────────────── */
function LiveEventRow({ evt, index }) {
  const style = getStyle(evt.event);
  const [expanded, setExpanded] = useState(false);
  const details = Object.entries(evt).filter(([k]) => k !== "event");

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}33`,
        borderLeft: `3px solid ${style.border}`,
        borderRadius: "10px",
        padding: "12px 16px",
        cursor: "pointer",
        animation: index === 0 ? "slideIn 0.3s ease" : "none",
        transition: "background 0.15s",
        marginBottom: "8px",
      }}
      onMouseEnter={e => e.currentTarget.style.background = style.bg.replace(")", ", 0.8)").replace("rgb", "rgba")}
      onMouseLeave={e => e.currentTarget.style.background = style.bg}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Dot */}
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: style.dot, flexShrink: 0,
          boxShadow: `0 0 6px ${style.dot}`,
        }} />

        {/* Badge */}
        <span style={{
          fontSize: "9px", fontWeight: "800", letterSpacing: "0.08em",
          padding: "2px 7px", borderRadius: "20px",
          background: `${style.border}22`, color: style.border,
          flexShrink: 0,
        }}>{style.label}</span>

        {/* Event name */}
        <span style={{ fontSize: "13px", color: "#f1f5f9", fontWeight: "600", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {evt.event}
        </span>

        {/* Quick preview */}
        <span style={{ fontSize: "11px", color: "#64748b", flexShrink: 0 }}>
          {evt.page_path || evt.project_name || evt.contact_method || ""}
        </span>

        {/* Time */}
        <span style={{ fontSize: "11px", color: "#475569", flexShrink: 0 }}>
          {fmtTime(evt._capturedAt || evt.timestamp)}
        </span>

        {/* Chevron */}
        <span style={{ color: "#475569", fontSize: "12px", flexShrink: 0 }}>
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded payload */}
      {expanded && (
        <div style={{
          marginTop: "12px", paddingTop: "12px",
          borderTop: `1px solid ${style.border}22`,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px",
        }}>
          {details.map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "9px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</span>
              <span style={{
                fontSize: "12px", color: "#e2e8f0",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }} title={String(v ?? "")}>
                {v === "" || v === null || v === undefined ? <em style={{ color: "#475569" }}>—</em> : String(v)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── History Row ──────────────────────────────────────────────────────── */
function HistoryRow({ visit }) {
  return (
    <tr style={{ borderBottom: "1px solid #0f172a" }}
      onMouseEnter={e => e.currentTarget.style.background = "#0f172a"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <td style={{ padding: "10px 12px", color: "#a5b4fc" }}>{visit.page_path || "/"}</td>
      <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{visit.country || "—"}</td>
      <td style={{ padding: "10px 12px" }}>
        <span style={{
          background: visit.device_type === "mobile" ? "#451a03" : "#14290d",
          color: visit.device_type === "mobile" ? "#fb923c" : "#4ade80",
          padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
        }}>{visit.device_type || "—"}</span>
      </td>
      <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{visit.browser || "—"}</td>
      <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{visit.os || "—"}</td>
      <td style={{ padding: "10px 12px", color: "#64748b", fontSize: "12px", whiteSpace: "nowrap" }}>
        {visit.session_id?.slice(0, 12) || "—"}
      </td>
      <td style={{ padding: "10px 12px", color: "#64748b", fontSize: "12px", whiteSpace: "nowrap" }}>
        {fmtDate(visit.visited_at)}
      </td>
    </tr>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */
export default function EventsMonitor({ user }) {
  const [tab, setTab] = useState("live"); // "live" | "history"

  // Live dataLayer capture
  const [liveEvents, setLiveEvents] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const [filter, setFilter] = useState("all");
  const patchedRef = useRef(false);

  // History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyRange, setHistoryRange] = useState(7);

  /* ── Patch window.dataLayer.push to capture events in real time ── */
  useEffect(() => {
    if (typeof window === "undefined" || patchedRef.current) return;
    patchedRef.current = true;

    window.dataLayer = window.dataLayer || [];

    // Replay any events already in dataLayer before we patched
    const existing = [...window.dataLayer];
    if (existing.length) {
      setLiveEvents(
        existing
          .filter((e) => e && e.event)
          .map((e) => ({ ...e, _capturedAt: new Date().toISOString() }))
          .reverse()
      );
    }

    const originalPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = function (...args) {
      const result = originalPush(...args);
      args.forEach((payload) => {
        if (payload && payload.event && !isPausedRef.current) {
          setLiveEvents((prev) => [
            { ...payload, _capturedAt: new Date().toISOString() },
            ...prev.slice(0, 199), // keep max 200
          ]);
        }
      });
      return result;
    };

    return () => {
      // Restore on unmount
      window.dataLayer.push = originalPush;
      patchedRef.current = false;
    };
  }, []);

  /* ── Pause ref sync ── */
  const togglePause = useCallback(() => {
    setIsPaused((v) => {
      isPausedRef.current = !v;
      return !v;
    });
  }, []);

  /* ── Fetch history from Supabase ── */
  useEffect(() => {
    if (tab !== "history") return;
    fetchHistory();
  }, [tab, historyRange]);

  async function fetchHistory() {
    setHistoryLoading(true);
    try {
      const since = historyRange === 0
        ? new Date(0).toISOString()
        : new Date(Date.now() - historyRange * 24 * 60 * 60 * 1000).toISOString();

      const { data } = await supabase
        .from("page_visits")
        .select("*")
        .gte("visited_at", since)
        .order("visited_at", { ascending: false })
        .limit(200);

      setHistory(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  }

  /* ── Filtered live events ── */
  const displayedEvents = filter === "all"
    ? liveEvents
    : liveEvents.filter((e) => e.event === filter);

  const eventTypes = ["all", ...Array.from(new Set(liveEvents.map((e) => e.event)))];

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .tab-btn { cursor: pointer; padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1px solid #1e293b; background: transparent; color: #64748b; transition: all 0.2s; }
        .tab-btn.active { background: #6366f1; border-color: #6366f1; color: #fff; }
        .tab-btn:hover:not(.active) { border-color: #334155; color: #cbd5e1; }
        .filter-chip { cursor: pointer; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid #1e293b; background: transparent; color: #64748b; transition: all 0.2s; white-space: nowrap; }
        .filter-chip.active { background: #1e293b; color: #f1f5f9; border-color: #334155; }
        .filter-chip:hover:not(.active) { border-color: #334155; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020817 0%, #0a0f1e 100%)",
        padding: "32px 20px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "#f1f5f9",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                ⚡ Events Monitor
              </h1>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "13px" }}>
                Live dataLayer stream + historical visit log · <span style={{ color: "#a5b4fc" }}>{user.email}</span>
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <a href="/dashboard" style={{ padding: "8px 16px", background: "#1e293b", borderRadius: "8px", color: "#cbd5e1", fontSize: "13px", textDecoration: "none", fontWeight: "500" }}>
                ← Dashboard
              </a>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            <button className={`tab-btn${tab === "live" ? " active" : ""}`} onClick={() => setTab("live")}>
              ⚡ Live Stream
              {liveEvents.length > 0 && (
                <span style={{
                  marginLeft: "8px", background: tab === "live" ? "rgba(255,255,255,0.25)" : "#6366f1",
                  color: "#fff", borderRadius: "20px", padding: "1px 7px", fontSize: "11px",
                }}>{liveEvents.length}</span>
              )}
            </button>
            <button className={`tab-btn${tab === "history" ? " active" : ""}`} onClick={() => setTab("history")}>
              🗃️ Visit History
            </button>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              LIVE STREAM TAB
          ══════════════════════════════════════════════════════════════ */}
          {tab === "live" && (
            <>
              {/* Controls */}
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                marginBottom: "16px", flexWrap: "wrap",
              }}>
                {/* Status dot */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: isPaused ? "#f59e0b" : "#4ade80",
                    boxShadow: isPaused ? "none" : "0 0 6px #4ade80",
                    animation: isPaused ? "none" : "pulse 1.5s ease-in-out infinite",
                  }} />
                  <span style={{ fontSize: "12px", color: isPaused ? "#f59e0b" : "#4ade80", fontWeight: "600" }}>
                    {isPaused ? "PAUSED" : "LISTENING"}
                  </span>
                </div>

                <button
                  onClick={togglePause}
                  style={{
                    padding: "6px 14px", background: isPaused ? "#14290d" : "#2d1206",
                    border: `1px solid ${isPaused ? "#4ade80" : "#f59e0b"}`,
                    borderRadius: "8px", color: isPaused ? "#4ade80" : "#f59e0b",
                    fontSize: "12px", fontWeight: "600", cursor: "pointer",
                  }}
                >
                  {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>

                <button
                  onClick={() => setLiveEvents([])}
                  style={{
                    padding: "6px 14px", background: "transparent",
                    border: "1px solid #334155", borderRadius: "8px",
                    color: "#64748b", fontSize: "12px", cursor: "pointer",
                  }}
                >
                  🗑 Clear
                </button>

                {/* Event type filters */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginLeft: "auto" }}>
                  {eventTypes.slice(0, 8).map((type) => (
                    <button
                      key={type}
                      className={`filter-chip${filter === type ? " active" : ""}`}
                      onClick={() => setFilter(type)}
                    >
                      {type === "all" ? "All" : type.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Empty state */}
              {displayedEvents.length === 0 && (
                <div style={{
                  background: "#0a1628", border: "1px dashed #1e293b",
                  borderRadius: "16px", padding: "60px 24px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚡</div>
                  <div style={{ fontSize: "16px", color: "#334155", fontWeight: "600" }}>
                    Waiting for events…
                  </div>
                  <div style={{ fontSize: "13px", color: "#1e293b", marginTop: "8px" }}>
                    Navigate between pages or interact with the portfolio to see events appear here in real time.
                  </div>
                  <div style={{ marginTop: "20px", fontSize: "12px", color: "#334155" }}>
                    💡 Tip: Open this page in one tab and browse your portfolio in another tab on the same browser.
                  </div>
                </div>
              )}

              {/* Event list */}
              <div>
                {displayedEvents.map((evt, i) => (
                  <LiveEventRow key={`${evt._capturedAt}-${i}`} evt={evt} index={i} />
                ))}
              </div>

              {/* Legend */}
              {liveEvents.length > 0 && (
                <div style={{
                  marginTop: "24px", padding: "16px 20px",
                  background: "#0a1628", border: "1px solid #1e293b",
                  borderRadius: "12px", display: "flex", flexWrap: "wrap", gap: "12px",
                }}>
                  <span style={{ fontSize: "11px", color: "#64748b", alignSelf: "center" }}>Legend:</span>
                  {Object.entries(EVENT_COLORS).filter(([k]) => k !== "default").map(([name, s]) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.dot }} />
                      <span style={{ fontSize: "10px", color: "#64748b" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════
              HISTORY TAB
          ══════════════════════════════════════════════════════════════ */}
          {tab === "history" && (
            <>
              {/* Range selector */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Period:</span>
                {[
                  { label: "Last 7 days", val: 7 },
                  { label: "Last 30 days", val: 30 },
                  { label: "All time", val: 0 },
                ].map(({ label, val }) => (
                  <button
                    key={val}
                    className={`tab-btn${historyRange === val ? " active" : ""}`}
                    style={{ padding: "6px 14px", fontSize: "12px" }}
                    onClick={() => setHistoryRange(val)}
                  >{label}</button>
                ))}
                {historyLoading && (
                  <div style={{
                    width: "16px", height: "16px",
                    border: "2px solid #1e293b", borderTopColor: "#6366f1",
                    borderRadius: "50%", animation: "spin 0.8s linear infinite",
                  }} />
                )}
                <span style={{ marginLeft: "auto", fontSize: "12px", color: "#64748b" }}>
                  {history.length} rows
                </span>
              </div>

              <div style={{
                background: "#0a1628", border: "1px solid #1e293b",
                borderRadius: "16px", overflow: "hidden",
              }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #1e293b" }}>
                        {["Page", "Country", "Device", "Browser", "OS", "Session ID", "Time"].map((h) => (
                          <th key={h} style={{
                            textAlign: "left", padding: "12px 12px",
                            color: "#64748b", fontWeight: "600", fontSize: "10px",
                            textTransform: "uppercase", letterSpacing: "0.06em",
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {history.length === 0 && !historyLoading ? (
                        <tr>
                          <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#334155" }}>
                            No page_visits table data yet. Run the Supabase SQL to create the table, then browse your portfolio.
                          </td>
                        </tr>
                      ) : (
                        history.map((v, i) => <HistoryRow key={i} visit={v} />)
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
