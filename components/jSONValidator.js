import { useState, useEffect, useRef, useCallback } from "react";

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

  .jv-root {
    --bg:       #07080a;
    --surface:  #0f1115;
    --surface2: #13161d;
    --border:   rgba(255,255,255,0.06);
    --border2:  rgba(255,255,255,0.12);
    --text:     #e8eaf0;
    --muted:    #636878;
    --muted2:   #8a90a8;
    --accent:   #4d7cff;
    --accent-g: #00e5a0;
    --accent-r: #ff6b6b;
    --accent-y: #f5c542;
    --syn-key:  #79b8ff;
    --syn-str:  #9ecbff;
    --syn-num:  #f5c542;
    --syn-bool: #ff9f5a;
    --syn-null: #ff6b6b;

    font-family: 'Syne', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
     margin-top:5rem 
  }

  /* noise */
  .jv-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0; opacity: .5;
  }

  /* blobs */
  .jv-blobs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .jv-blob  { position: absolute; border-radius: 50%; filter: blur(120px); opacity: .1; animation: jv-drift 18s ease-in-out infinite alternate; }
  .jv-blob-1 { width:500px; height:500px; background:var(--accent);   top:-150px; left:-150px; }
  .jv-blob-2 { width:400px; height:400px; background:var(--accent-g); bottom:-80px; right:-80px; animation-delay:-8s; }
  @keyframes jv-drift {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(30px,-20px) scale(1.04); }
  }

  /* nav */
  .jv-nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 28px;
    background: rgba(7,8,10,.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .jv-brand {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; color: var(--text);
  }
  .jv-brand-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: color-mix(in srgb, var(--accent) 20%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: var(--accent);
    font-family: 'DM Mono', monospace;
  }
  .jv-brand-name { font-size: 14px; font-weight: 700; }
  .jv-nav-back {
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    display: flex; align-items: center; gap: 6px;
    transition: color .2s; cursor: pointer; background: none; border: none;
  }
  .jv-nav-back:hover { color: var(--text); }
  .jv-nav-stats { display: flex; gap: 20px; }
  .jv-nav-stat  { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
  .jv-stat-dot  { width: 6px; height: 6px; border-radius: 50%; }

  /* toolbar */
  .jv-toolbar {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    padding: 10px 18px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    flex-shrink: 0; position: relative; z-index: 1;
  }
  .jv-tb-group { display: flex; gap: 6px; }
  .jv-tb-sep   { width: 1px; height: 28px; background: var(--border); margin: 0 4px; }

  .jv-btn {
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
    padding: 7px 14px; border-radius: 8px;
    border: 1px solid var(--border); color: var(--muted);
    background: transparent; cursor: pointer; transition: all .2s;
    display: flex; align-items: center; gap: 6px; white-space: nowrap;
  }
  .jv-btn:hover { border-color: var(--border2); color: var(--text); background: var(--surface2); }
  .jv-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .jv-btn.primary:hover { background: #6b93ff; border-color: #6b93ff; }

  .jv-select {
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
    padding: 7px 12px; border-radius: 8px;
    border: 1px solid var(--border); color: var(--muted);
    background: var(--surface2); cursor: pointer; transition: all .2s;
    outline: none;
  }
  .jv-select:hover { border-color: var(--border2); color: var(--text); }
  .jv-select option { background: #13161d; }

  /* split */
  .jv-split {
    display: grid; grid-template-columns: 1fr 1fr;
    flex: 1; overflow: hidden; position: relative; z-index: 1;
  }

  /* pane */
  .jv-pane { display: flex; flex-direction: column; border-right: 1px solid var(--border); overflow: hidden; }
  .jv-pane:last-child { border-right: none; }

  .jv-pane-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 14px;
    border-bottom: 1px solid var(--border);
    background: var(--surface); flex-shrink: 0;
  }
  .jv-pane-title {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--muted);
  }
  .jv-pane-actions { display: flex; gap: 6px; }
  .jv-pane-btn {
    font-family: 'DM Mono', monospace; font-size: 10px;
    padding: 4px 10px; border-radius: 6px;
    border: 1px solid var(--border); color: var(--muted);
    background: transparent; cursor: pointer; transition: all .2s;
  }
  .jv-pane-btn:hover { color: var(--text); border-color: var(--border2); }

  /* editor */
  .jv-editor-wrap { position: relative; flex: 1; overflow: hidden; display: flex; }
  .jv-line-nums {
    padding: 14px 10px 14px 14px;
    font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.6;
    color: var(--muted); text-align: right; user-select: none; flex-shrink: 0;
    overflow: hidden; border-right: 1px solid var(--border);
    background: rgba(0,0,0,.2); min-width: 46px; white-space: pre;
  }
  .jv-textarea {
    flex: 1; padding: 14px;
    font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.6;
    color: var(--text); background: transparent;
    border: none; outline: none; resize: none; tab-size: 2; overflow-y: auto;
  }
  .jv-textarea::placeholder { color: var(--muted); }
  .jv-textarea::-webkit-scrollbar { width: 6px; }
  .jv-textarea::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  /* error panel */
  .jv-error {
    margin: 10px 14px; padding: 10px 14px; border-radius: 10px;
    background: color-mix(in srgb, var(--accent-r) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent-r) 20%, transparent);
    font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.6;
    color: var(--accent-r); flex-shrink: 0;
  }
  .jv-error-title { margin-bottom: 3px; letter-spacing: .05em; }
  .jv-error-msg   { color: var(--muted2); }

  /* output */
  .jv-output {
    flex: 1; overflow-y: auto; padding: 14px;
    font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.6;
  }
  .jv-output::-webkit-scrollbar { width: 6px; }
  .jv-output::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
  .jv-output pre { margin: 0; white-space: pre-wrap; word-break: break-word; }

  /* syntax highlight spans */
  .syn-key  { color: var(--syn-key); }
  .syn-str  { color: var(--syn-str); }
  .syn-num  { color: var(--syn-num); }
  .syn-bool { color: var(--syn-bool); }
  .syn-null { color: var(--syn-null); }

  /* tabs */
  .jv-tabs { display: flex; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .jv-tab {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 10px 16px; cursor: pointer; color: var(--muted);
    border-bottom: 2px solid transparent; transition: all .2s;
    background: transparent; border-top: none; border-left: none; border-right: none;
  }
  .jv-tab:hover { color: var(--text); }
  .jv-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* search bar */
  .jv-search {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 10px; margin: 8px 14px;
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    flex-shrink: 0;
  }
  .jv-search-icon  { color: var(--muted); font-size: 13px; }
  .jv-search-input {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text);
  }
  .jv-search-input::placeholder { color: var(--muted); }
  .jv-search-count { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); }

  /* path bar */
  .jv-path {
    padding: 5px 14px; min-height: 28px;
    font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 4px; flex-wrap: wrap; flex-shrink: 0;
  }
  .jv-path-seg   { color: var(--accent); cursor: pointer; }
  .jv-path-seg:hover { text-decoration: underline; }
  .jv-path-arrow { color: var(--border2); }

  /* tree */
  .jv-tree-node { padding-left: 20px; }
  .jv-tree-row  {
    display: flex; align-items: flex-start; gap: 4px;
    cursor: pointer; border-radius: 4px; padding: 1px 4px; transition: background .15s;
  }
  .jv-tree-row:hover { background: rgba(255,255,255,.04); }
  .jv-tree-toggle {
    width: 14px; height: 14px; flex-shrink: 0; margin-top: 3px;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); font-size: 10px; transition: transform .2s;
  }
  .jv-tree-toggle.open { transform: rotate(90deg); }
  .jv-tree-children { border-left: 1px solid var(--border); margin-left: 6px; }

  /* type badges */
  .tb { font-size: 9px; padding: 1px 5px; border-radius: 3px; margin-left: 6px; margin-top: 2px; font-family: 'DM Mono', monospace; letter-spacing: .05em; }
  .tb-obj  { background: rgba(77,124,255,.15);  color: var(--accent);   }
  .tb-arr  { background: rgba(0,229,160,.15);   color: var(--accent-g); }
  .tb-str  { background: rgba(158,203,255,.1);  color: var(--syn-str);  }
  .tb-num  { background: rgba(245,197,66,.1);   color: var(--syn-num);  }
  .tb-bool { background: rgba(255,159,90,.1);   color: var(--syn-bool); }
  .tb-null { background: rgba(255,107,107,.1);  color: var(--syn-null); }

  /* diff */
  .jv-diff-line { display: flex; gap: 8px; font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
  .jv-diff-add  { background: rgba(0,229,160,.07); color: var(--accent-g); }
  .jv-diff-rem  { background: rgba(255,107,107,.07); color: var(--accent-r); }
  .jv-diff-ctx  { color: var(--muted); }
  .jv-diff-sym  { width: 12px; flex-shrink: 0; }

  /* status bar */
  .jv-statusbar {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    padding: 7px 18px;
    border-top: 1px solid var(--border);
    background: var(--surface);
    font-family: 'DM Mono', monospace; font-size: 11px;
    flex-shrink: 0; position: relative; z-index: 1;
  }
  .jv-status-valid   { color: var(--accent-g); display: flex; align-items: center; gap: 6px; }
  .jv-status-invalid { color: var(--accent-r); display: flex; align-items: center; gap: 6px; }
  .jv-status-idle    { color: var(--muted); }
  .jv-status-dot     { width: 7px; height: 7px; border-radius: 50%; }
  .jv-status-sep     { color: var(--border2); }
  .jv-status-info    { color: var(--muted); }

  /* empty state */
  .jv-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 10px;
    color: var(--muted); text-align: center; padding: 32px;
  }
  .jv-empty-icon  { font-size: 30px; opacity: .4; }
  .jv-empty-title { font-size: 14px; font-weight: 600; }
  .jv-empty-sub   { font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.6; max-width: 240px; }

  /* toast */
  .jv-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    font-family: 'DM Mono', monospace; font-size: 12px;
    padding: 10px 18px; border-radius: 10px;
    background: var(--surface2); border: 1px solid var(--border2); color: var(--text);
    display: flex; align-items: center; gap: 8px;
    transform: translateY(80px); opacity: 0;
    transition: all .3s cubic-bezier(.2,.8,.2,1);
    pointer-events: none;
  }
  .jv-toast.show { transform: translateY(0); opacity: 1; }

  /* scrollbars */
  .jv-root ::-webkit-scrollbar       { width: 6px; height: 6px;}
  .jv-root ::-webkit-scrollbar-track { background: transparent; }
  .jv-root ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  @media (max-width: 768px) {
    .jv-split { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; overflow-y: auto; }
    .jv-pane  { border-right: none; border-bottom: 1px solid var(--border); min-height: 50vh; }
    .jv-nav-stats { display: none; }
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────
const SAMPLE = {
  name: "Micro Tools",
  version: "1.0.0",
  author: {
    name: "Your Name",
    email: "you@example.com",
    portfolio: "https://yoursite.dev",
  },
  tools: [
    { id: 1, name: "JSON Validator", tags: ["data", "dev"], featured: true },
    { id: 2, name: "Location Tracker", tags: ["location"], featured: false },
    {
      id: 3,
      name: "Color Converter",
      tags: ["dev", "design"],
      featured: false,
    },
  ],
  stats: { totalTools: 8, signupsRequired: 0, freeForever: true },
  meta: { createdAt: 1742648400, lastUpdated: "2025-03-22", license: "MIT" },
};

function fmtBytes(n) {
  if (n < 1024) return n + " B";
  if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
  return (n / 1048576).toFixed(2) + " MB";
}

function countKeys(obj) {
  if (typeof obj !== "object" || obj === null) return 0;
  let c = Array.isArray(obj) ? 0 : Object.keys(obj).length;
  const vals = Array.isArray(obj) ? obj : Object.values(obj);
  vals.forEach((v) => {
    c += countKeys(v);
  });
  return c;
}

function maxDepth(obj, d = 0) {
  if (typeof obj !== "object" || obj === null) return d;
  const vals = Array.isArray(obj) ? obj : Object.values(obj);
  if (!vals.length) return d + 1;
  return Math.max(...vals.map((v) => maxDepth(v, d + 1)));
}

function syntaxHL(json) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="syn-key">${match}</span>`;
        return `<span class="syn-str">${match}</span>`;
      }
      if (/true|false/.test(match))
        return `<span class="syn-bool">${match}</span>`;
      if (/null/.test(match)) return `<span class="syn-null">${match}</span>`;
      return `<span class="syn-num">${match}</span>`;
    },
  );
}

function getIndentValue(indent) {
  return indent === "tab" ? "\t" : parseInt(indent);
}

// ── Tree View ──────────────────────────────────────────────────────────────
function TreeLeaf({ keyName, value }) {
  const type = typeof value;
  let valEl;
  if (value === null)
    valEl = (
      <>
        <span className="syn-null">null</span>
        <span className="tb tb-null">null</span>
      </>
    );
  else if (type === "boolean")
    valEl = (
      <>
        <span className="syn-bool">{String(value)}</span>
        <span className="tb tb-bool">bool</span>
      </>
    );
  else if (type === "number")
    valEl = (
      <>
        <span className="syn-num">{value}</span>
        <span className="tb tb-num">num</span>
      </>
    );
  else {
    const display =
      String(value).length > 80
        ? String(value).slice(0, 80) + "…"
        : String(value);
    valEl = (
      <>
        <span className="syn-str">"{display}"</span>
        <span className="tb tb-str">str</span>
      </>
    );
  }
  return (
    <div
      className="jv-tree-row"
      style={{ alignItems: "center" }}
    >
      <div
        className="jv-tree-toggle"
        style={{ color: "transparent" }}
      >
        ▶
      </div>
      {keyName !== null && (
        <>
          <span className="syn-key">"{keyName}"</span>
          <span style={{ color: "var(--muted)", margin: "0 4px" }}>:</span>
        </>
      )}
      {valEl}
    </div>
  );
}

function TreeNode({ keyName, data, searchQuery }) {
  const [collapsed, setCollapsed] = useState(false);
  const isArr = Array.isArray(data);
  const isObj = typeof data === "object" && data !== null && !isArr;

  if (!isArr && !isObj) {
    return (
      <TreeLeaf
        keyName={keyName}
        value={data}
      />
    );
  }

  const entries = isArr ? data.map((v, i) => [i, v]) : Object.entries(data);
  const count = entries.length;
  const badge = isArr ? (
    <span className="tb tb-arr">[{count}]</span>
  ) : (
    <span className="tb tb-obj">&#123;{count}&#125;</span>
  );

  return (
    <div>
      <div
        className="jv-tree-row"
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className={`jv-tree-toggle${collapsed ? "" : " open"}`}>▶</div>
        {keyName !== null && (
          <>
            <span className="syn-key">"{keyName}"</span>
            <span style={{ color: "var(--muted)", margin: "0 4px" }}>:</span>
          </>
        )}
        {badge}
      </div>
      {!collapsed && (
        <div className="jv-tree-children">
          {entries.map(([k, v]) => (
            <div
              key={k}
              className="jv-tree-node"
            >
              <TreeNode
                keyName={k}
                data={v}
                searchQuery={searchQuery}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Diff View ──────────────────────────────────────────────────────────────
function DiffView({ original, formatted }) {
  if (!formatted) {
    return (
      <div className="jv-empty">
        <div className="jv-empty-icon">±</div>
        <div className="jv-empty-title">Diff view</div>
        <div className="jv-empty-sub">
          Shows changes between your raw input and the formatted output.
        </div>
      </div>
    );
  }
  const a = original.split("\n");
  const b = formatted.split("\n");
  const lines = [];
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) {
    const la = a[i],
      lb = b[i];
    if (la === undefined) lines.push({ type: "add", text: lb });
    else if (lb === undefined) lines.push({ type: "rem", text: la });
    else if (la !== lb) {
      lines.push({ type: "rem", text: la });
      lines.push({ type: "add", text: lb });
    } else lines.push({ type: "ctx", text: la });
  }
  return (
    <div className="jv-output">
      <div
        style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 11,
          color: "var(--muted)",
          marginBottom: 12,
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        Raw input vs. formatted output
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          className={`jv-diff-line jv-diff-${l.type}`}
        >
          <span className="jv-diff-sym">
            {l.type === "add" ? "+" : l.type === "rem" ? "-" : " "}
          </span>
          <span>{l.text}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function JSONValidator({ onBack }) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState("2");
  const [activeTab, setActiveTab] = useState("formatted");
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState("root");
  const [toast, setToast] = useState({ msg: "", icon: "✓", show: false });
  const [stats, setStats] = useState({ bytes: 0, lines: 1, keys: 0, depth: 0 });

  const textareaRef = useRef(null);
  const lineNumsRef = useRef(null);
  const debounceRef = useRef(null);
  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);

  // ── Toast ──────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, icon = "✓") => {
    setToast({ msg, icon, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      2200,
    );
  }, []);

  // ── Parse & update ────────────────────────────────────────────────────
  const updateStats = useCallback((raw, parsed) => {
    const bytes = new Blob([raw]).size;
    const lines = raw ? raw.split("\n").length : 1;
    const keys = parsed ? countKeys(parsed) : 0;
    const depth = parsed ? maxDepth(parsed) : 0;
    setStats({ bytes, lines, keys, depth });
  }, []);

  const tryParse = useCallback(
    (raw) => {
      try {
        const data = JSON.parse(raw);
        setParsedData(data);
        setParseError(null);
        updateStats(raw, data);
        return data;
      } catch (e) {
        setParsedData(null);
        setParseError(e.message);
        updateStats(raw, null);
        return null;
      }
    },
    [updateStats],
  );

  // ── Debounced live validation ─────────────────────────────────────────
  const handleInput = useCallback(
    (val) => {
      setInput(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (val.trim()) tryParse(val.trim());
        else {
          setParsedData(null);
          setParseError(null);
          updateStats("", null);
        }
      }, 350);
    },
    [tryParse, updateStats],
  );

  // ── Line numbers sync ─────────────────────────────────────────────────
  const handleScroll = () => {
    if (lineNumsRef.current && textareaRef.current) {
      lineNumsRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineCount = input.split("\n").length;
  const lineNums = Array.from({ length: lineCount }, (_, i) => i + 1).join(
    "\n",
  );

  // ── Keyboard shortcuts ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        formatJSON();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "M") {
        e.preventDefault();
        minifyJSON();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        downloadJSON();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // ── Drag & drop ───────────────────────────────────────────────────────
  useEffect(() => {
    const onDragOver = (e) => e.preventDefault();
    const onDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        setInput(text);
        tryParse(text.trim());
        showToast(`Dropped ${file.name}`);
      };
      reader.readAsText(file);
    };
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [tryParse, showToast]);

  // ── Tab key in textarea ───────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const s = ta.selectionStart,
        end = ta.selectionEnd;
      const newVal = input.substring(0, s) + "  " + input.substring(end);
      setInput(newVal);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = s + 2;
      }, 0);
    }
  };

  // ── Actions ───────────────────────────────────────────────────────────
  const getFormatted = useCallback(() => {
    if (!parsedData) return null;
    return JSON.stringify(parsedData, null, getIndentValue(indent));
  }, [parsedData, indent]);

  function formatJSON() {
    const raw = input.trim();
    if (!raw) return;
    const data = tryParse(raw);
    if (data !== null) {
      const formatted = JSON.stringify(data, null, getIndentValue(indent));
      setInput(formatted);
      showToast("Formatted!");
    }
  }

  function minifyJSON() {
    const raw = input.trim();
    if (!raw) return;
    const data = tryParse(raw);
    if (data === null) {
      showToast("Cannot minify: invalid JSON", "✕");
      return;
    }
    setInput(JSON.stringify(data));
    setActiveTab("minified");
    showToast("Minified!");
  }

  function sortKeys() {
    const raw = input.trim();
    if (!raw) return;
    const data = tryParse(raw);
    if (data === null) {
      showToast("Cannot sort: invalid JSON", "✕");
      return;
    }
    function sortObj(o) {
      if (Array.isArray(o)) return o.map(sortObj);
      if (typeof o === "object" && o !== null)
        return Object.fromEntries(
          Object.keys(o)
            .sort()
            .map((k) => [k, sortObj(o[k])]),
        );
      return o;
    }
    const sorted = sortObj(data);
    const formatted = JSON.stringify(sorted, null, getIndentValue(indent));
    setInput(formatted);
    tryParse(formatted);
    showToast("Keys sorted alphabetically!");
  }

  function removeComments() {
    let raw = input;
    raw = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
    setInput(raw);
    tryParse(raw.trim());
    showToast("Comments stripped!");
  }

  function fixJSON() {
    let raw = input.trim();
    if (!raw) return;
    raw = raw.replace(/,\s*([}\]])/g, "$1");
    raw = raw.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
    raw = raw.replace(/'/g, '"');
    raw = raw.replace(/:\s*'([^']*)'/g, ': "$1"');
    setInput(raw);
    tryParse(raw.trim());
    showToast("Attempted JSON repair!", "⚙");
  }

  async function copyOutput() {
    if (!parsedData) {
      showToast("Nothing to copy", "✕");
      return;
    }
    const text =
      activeTab === "minified"
        ? JSON.stringify(parsedData)
        : JSON.stringify(parsedData, null, getIndentValue(indent));
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  }

  function downloadJSON() {
    if (!parsedData) {
      showToast("Nothing to download", "✕");
      return;
    }
    const text = JSON.stringify(parsedData, null, getIndentValue(indent));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([text], { type: "application/json" }),
    );
    a.download = "formatted.json";
    a.click();
    showToast("Downloaded!", "↓");
  }

  function clearAll() {
    setInput("");
    setParsedData(null);
    setParseError(null);
    setStats({ bytes: 0, lines: 1, keys: 0, depth: 0 });
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      tryParse(text.trim());
    } catch {
      showToast("Clipboard access denied", "✕");
    }
  }

  function loadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setInput(text);
      tryParse(text.trim());
      showToast(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function loadSample() {
    const text = JSON.stringify(SAMPLE, null, 2);
    setInput(text);
    tryParse(text);
    showToast("Sample loaded!", "★");
  }

  // ── Derived values ────────────────────────────────────────────────────
  const formatted = getFormatted();
  const minified = parsedData ? JSON.stringify(parsedData) : null;
  const isValid = parsedData !== null;
  const hasInput = input.trim().length > 0;

  // ── Status ────────────────────────────────────────────────────────────
  let statusEl;
  if (!hasInput) {
    statusEl = (
      <span className="jv-status-idle">Ready — paste JSON to begin</span>
    );
  } else if (isValid) {
    statusEl = (
      <span className="jv-status-valid">
        <div
          className="jv-status-dot"
          style={{ background: "var(--accent-g)" }}
        />
        Valid JSON
      </span>
    );
  } else {
    statusEl = (
      <span className="jv-status-invalid">
        <div
          className="jv-status-dot"
          style={{ background: "var(--accent-r)" }}
        />
        {parseError}
      </span>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="jv-root">
        {/* blobs */}
        <div className="jv-blobs">
          <div className="jv-blob jv-blob-1" />
          <div className="jv-blob jv-blob-2" />
        </div>

        {/* nav */}
        {/* <nav className="jv-nav">
          <div className="jv-brand">
            <div className="jv-brand-icon">{"{ }"}</div>
            <span className="jv-brand-name">JSON Tool</span>
          </div>
          <button
            className="jv-nav-back"
            onClick={onBack}
          >
            ← Back to Micro Tools
          </button>
          <div className="jv-nav-stats">
            <div className="jv-nav-stat">
              <div
                className="jv-stat-dot"
                style={{
                  background: !hasInput
                    ? "var(--muted)"
                    : isValid
                      ? "var(--accent-g)"
                      : "var(--accent-r)",
                }}
              />
              <span
                style={{
                  color: !hasInput
                    ? "var(--muted)"
                    : isValid
                      ? "var(--accent-g)"
                      : "var(--accent-r)",
                }}
              >
                {!hasInput ? "Ready" : isValid ? "Valid" : "Invalid"}
              </span>
            </div>
            <div className="jv-nav-stat">{fmtBytes(stats.bytes)}</div>
            <div className="jv-nav-stat">{stats.lines}L</div>
          </div>
        </nav> */}

        {/* toolbar */}
        <div className="jv-toolbar">
          <div className="jv-tb-group">
            <button
              className="jv-btn primary"
              onClick={formatJSON}
            >
              ✦ Format
            </button>
            <button
              className="jv-btn"
              onClick={minifyJSON}
            >
              ⊟ Minify
            </button>
          </div>
          <div className="jv-tb-sep" />
          <select
            className="jv-select"
            value={indent}
            onChange={(e) => setIndent(e.target.value)}
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tabs</option>
          </select>
          <div className="jv-tb-sep" />
          <div className="jv-tb-group">
            <button
              className="jv-btn"
              onClick={sortKeys}
            >
              ↕ Sort Keys
            </button>
            <button
              className="jv-btn"
              onClick={removeComments}
            >
              ⌫ Strip Comments
            </button>
            <button
              className="jv-btn"
              onClick={fixJSON}
            >
              ⚙ Fix &amp; Repair
            </button>
          </div>
          <div className="jv-tb-sep" />
          <div className="jv-tb-group">
            <button
              className="jv-btn"
              onClick={copyOutput}
            >
              ⎘ Copy
            </button>
            <button
              className="jv-btn"
              onClick={downloadJSON}
            >
              ↓ Download
            </button>
            <button
              className="jv-btn"
              onClick={clearAll}
            >
              ✕ Clear
            </button>
          </div>
          <div className="jv-tb-sep" />
          <div className="jv-tb-group">
            <button
              className="jv-btn"
              onClick={loadSample}
            >
              ★ Sample
            </button>
            <button
              className="jv-btn"
              onClick={() => fileInputRef.current.click()}
            >
              ↑ Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt"
              style={{ display: "none" }}
              onChange={loadFile}
            />
          </div>
        </div>

        {/* split panes */}
        <div
          className="jv-split"
          style={{ flex: 1, overflow: "hidden" }}
        >
          {/* LEFT — input */}
          <div className="jv-pane">
            <div className="jv-pane-header">
              <span className="jv-pane-title">Input</span>
              <div className="jv-pane-actions">
                <button
                  className="jv-pane-btn"
                  onClick={pasteFromClipboard}
                >
                  Paste
                </button>
                <button
                  className="jv-pane-btn"
                  onClick={() => setInput("")}
                >
                  Clear
                </button>
              </div>
            </div>
            {parseError && hasInput && (
              <div className="jv-error">
                <div className="jv-error-title">⚠ Syntax Error</div>
                <div className="jv-error-msg">{parseError}</div>
              </div>
            )}
            <div className="jv-editor-wrap">
              <div
                className="jv-line-nums"
                ref={lineNumsRef}
              >
                {lineNums}
              </div>
              <textarea
                ref={textareaRef}
                className="jv-textarea"
                value={input}
                onChange={(e) => handleInput(e.target.value)}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                placeholder={`Paste your JSON here…\n\n{\n  "name": "Micro Tools",\n  "version": 1\n}`}
                spellCheck={false}
              />
            </div>
          </div>

          {/* RIGHT — output */}
          <div className="jv-pane">
            <div className="jv-pane-header">
              <span className="jv-pane-title">Output</span>
              <div className="jv-pane-actions">
                <button
                  className="jv-pane-btn"
                  onClick={copyOutput}
                >
                  Copy
                </button>
                <button
                  className="jv-pane-btn"
                  onClick={downloadJSON}
                >
                  Download
                </button>
              </div>
            </div>

            {/* tabs */}
            <div className="jv-tabs">
              {["formatted", "tree", "minified", "diff"].map((t) => (
                <button
                  key={t}
                  className={`jv-tab${activeTab === t ? " active" : ""}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* search (tree only) */}
            {activeTab === "tree" && (
              <div className="jv-search">
                <span className="jv-search-icon">⌕</span>
                <input
                  className="jv-search-input"
                  placeholder="Search keys or values…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <span className="jv-search-count">searching…</span>
                )}
              </div>
            )}

            {/* path breadcrumb (tree only) */}
            {activeTab === "tree" && (
              <div className="jv-path">
                {currentPath.split(".").map((seg, i, arr) => (
                  <span key={i}>
                    <span
                      className="jv-path-seg"
                      onClick={() =>
                        setCurrentPath(arr.slice(0, i + 1).join("."))
                      }
                    >
                      {seg}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="jv-path-arrow"> › </span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* formatted */}
            {activeTab === "formatted" &&
              (formatted ? (
                <div className="jv-output">
                  <pre
                    dangerouslySetInnerHTML={{ __html: syntaxHL(formatted) }}
                  />
                </div>
              ) : (
                <div className="jv-empty">
                  <div className="jv-empty-icon">{"{ }"}</div>
                  <div className="jv-empty-title">
                    {parseError ? "Invalid JSON" : "No output yet"}
                  </div>
                  <div className="jv-empty-sub">
                    {parseError ||
                      "Paste JSON on the left and click Format, or press Ctrl+Shift+F"}
                  </div>
                </div>
              ))}

            {/* tree */}
            {activeTab === "tree" &&
              (parsedData ? (
                <div className="jv-output">
                  <TreeNode
                    keyName={null}
                    data={parsedData}
                    searchQuery={searchQuery}
                  />
                </div>
              ) : (
                <div className="jv-empty">
                  <div className="jv-empty-icon">🌿</div>
                  <div className="jv-empty-title">Tree View</div>
                  <div className="jv-empty-sub">
                    Enter valid JSON to explore the tree
                  </div>
                </div>
              ))}

            {/* minified */}
            {activeTab === "minified" &&
              (minified ? (
                <div className="jv-output">
                  <pre
                    style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{ __html: syntaxHL(minified) }}
                  />
                </div>
              ) : (
                <div className="jv-empty">
                  <div className="jv-empty-icon">⊟</div>
                  <div className="jv-empty-title">Minified</div>
                  <div className="jv-empty-sub">
                    Enter valid JSON to see minified output
                  </div>
                </div>
              ))}

            {/* diff */}
            {activeTab === "diff" && (
              <DiffView
                original={input}
                formatted={formatted}
              />
            )}
          </div>
        </div>

        {/* status bar */}
        <div className="jv-statusbar">
          {statusEl}
          <span className="jv-status-sep">·</span>
          <span className="jv-status-info">
            {hasInput && isValid
              ? `${stats.keys} key${stats.keys === 1 ? "" : "s"}`
              : "— keys"}
          </span>
          <span className="jv-status-sep">·</span>
          <span className="jv-status-info">
            {hasInput && isValid ? `depth ${stats.depth}` : "depth —"}
          </span>
          <span className="jv-status-sep">·</span>
          <span className="jv-status-info">{fmtBytes(stats.bytes)}</span>
          <span className="jv-status-sep">·</span>
          <span className="jv-status-info">
            {stats.lines} line{stats.lines === 1 ? "" : "s"}
          </span>
        </div>

        {/* toast */}
        <div className={`jv-toast${toast.show ? " show" : ""}`}>
          <span>{toast.icon}</span> {toast.msg}
        </div>
      </div>
    </>
  );
}
