import { useState, useRef, useCallback, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&display=swap');

  .b64 {
    --bg:      #0a0a0a;
    --surface: #111;
    --border:  #1e1e1e;
    --border2: #2a2a2a;
    --text:    #e0e0e0;
    --muted:   #444;
    --muted2:  #666;
    --accent:  #ff9f5a;
    --green:   #00e5a0;
    --red:     #ff6b6b;

    font-family: 'DM Mono', monospace;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 24px 80px;
  }

  .b64-header { text-align: center; margin-bottom: 48px; }
  .b64-logo {
    display: inline-flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 10px;
    border: 1px solid var(--border2);
    font-size: 11px; color: var(--accent);
    margin-bottom: 20px; letter-spacing: .04em;
  }
  .b64-title { font-size: 22px; font-weight: 400; letter-spacing: -.02em; margin-bottom: 6px; }
  .b64-sub   { font-size: 12px; color: var(--muted2); letter-spacing: .04em; }

  .b64-toggle {
    display: flex; gap: 2px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 3px; margin-bottom: 32px;
  }
  .b64-toggle-btn {
    font-family: 'DM Mono', monospace; font-size: 11px;
    letter-spacing: .08em; text-transform: uppercase;
    padding: 7px 20px; border-radius: 5px; border: none;
    cursor: pointer; transition: all .2s; background: transparent; color: var(--muted2);
  }
  .b64-toggle-btn.on { background: var(--accent); color: #0a0a0a; }

  .b64-card {
    width: 100%; max-width: 680px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
  }

  .b64-area {
    width: 100%; padding: 20px;
    font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.65;
    color: var(--text); background: transparent;
    border: none; outline: none; resize: none; min-height: 140px; tab-size: 2;
  }
  .b64-area::placeholder { color: var(--muted); }

  .b64-divider {
    display: flex; align-items: center; gap: 10px;
    padding: 0 16px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    background: var(--bg); min-height: 38px;
  }
  .b64-divider-label { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); flex: 1; }
  .b64-mini-btn {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: .06em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 5px;
    border: 1px solid var(--border2); color: var(--muted2);
    background: transparent; cursor: pointer; transition: all .18s;
  }
  .b64-mini-btn:hover { color: var(--text); border-color: var(--text); }
  .b64-nano-select {
    font-family: 'DM Mono', monospace; font-size: 10px;
    background: transparent; border: none; color: var(--muted2); outline: none; cursor: pointer;
  }

  .b64-output-area {
    width: 100%; padding: 20px;
    font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.65;
    min-height: 120px; word-break: break-all; white-space: pre-wrap;
  }
  .b64-output-area.ok    { color: var(--green); }
  .b64-output-area.err   { color: var(--red);   }
  .b64-output-area.empty { color: var(--muted); font-style: italic; }

  .b64-actions {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    width: 100%; max-width: 680px; margin-top: 14px;
  }
  .b64-action-btn {
    font-family: 'DM Mono', monospace; font-size: 11px;
    letter-spacing: .08em; text-transform: uppercase;
    padding: 8px 16px; border-radius: 7px;
    border: 1px solid var(--border2); color: var(--muted2);
    background: transparent; cursor: pointer; transition: all .18s;
  }
  .b64-action-btn:hover { color: var(--text); border-color: var(--text); }
  .b64-action-btn.primary { border-color: var(--accent); color: var(--accent); }
  .b64-action-btn.primary:hover { background: var(--accent); color: #0a0a0a; }

  .b64-stats {
    display: flex; gap: 24px; margin-top: 18px;
    width: 100%; max-width: 680px;
    font-size: 11px; color: var(--muted2);
  }
  .b64-stat-val { color: var(--text); }

  .b64-extra-card {
    width: 100%; max-width: 680px; margin-top: 24px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
  }
  .b64-url-inner { display: flex; align-items: stretch; }
  .b64-url-input {
    flex: 1; padding: 14px 16px;
    font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text);
    background: transparent; border: none; outline: none;
  }
  .b64-url-input::placeholder { color: var(--muted); }
  .b64-url-sep   { width: 1px; background: var(--border); flex-shrink: 0; }
  .b64-url-out   { flex: 1; padding: 14px 16px; font-size: 12px; color: var(--green); word-break: break-all; white-space: pre-wrap; line-height: 1.6; }
  .b64-url-out.empty { color: var(--muted); font-style: italic; }

  .b64-dropzone {
    margin: 14px; border: 1px dashed var(--border2); border-radius: 8px;
    padding: 24px; text-align: center; cursor: pointer; transition: all .2s;
  }
  .b64-dropzone:hover, .b64-dropzone.drag { border-color: var(--accent); background: rgba(255,159,90,.04); }
  .b64-drop-text { font-size: 11px; color: var(--muted2); margin-top: 5px; }

  .b64-file-result {
    margin: 0 14px 14px; padding: 12px;
    background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  }
  .b64-file-name { font-size: 12px; margin-bottom: 3px; }
  .b64-file-meta { font-size: 10px; color: var(--muted2); margin-bottom: 10px; }
  .b64-file-prev { font-size: 11px; color: var(--green); word-break: break-all; white-space: pre-wrap; max-height: 80px; overflow-y: auto; line-height: 1.55; }
  .b64-file-btns { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }

  .b64-toast {
    position: fixed; bottom: 22px; right: 22px; z-index: 999;
    font-family: 'DM Mono', monospace; font-size: 11px;
    padding: 8px 14px; border-radius: 7px;
    background: var(--surface); border: 1px solid var(--border2); color: var(--text);
    transform: translateY(50px); opacity: 0;
    transition: all .25s cubic-bezier(.2,.8,.2,1); pointer-events: none;
  }
  .b64-toast.show { transform: translateY(0); opacity: 1; }

  .b64 ::-webkit-scrollbar { width: 4px; }
  .b64 ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  @media (max-width: 560px) {
    .b64 { padding: 40px 14px 60px; }
    .b64-url-inner { flex-direction: column; }
    .b64-url-sep { width: 100%; height: 1px; }
  }
`;

function fmtBytes(n) {
  if (!n) return "0 B";
  return n < 1024 ? n + " B" : (n / 1024).toFixed(1) + " KB";
}

function encodeB64(text, cs) {
  try {
    if (cs === "utf8") {
      const bytes = new TextEncoder().encode(text);
      let bin = "";
      bytes.forEach((b) => (bin += String.fromCharCode(b)));
      return { ok: true, result: btoa(bin) };
    }
    return { ok: true, result: btoa(text) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function decodeB64(b64, cs) {
  try {
    const bin = atob(b64.trim());
    if (cs === "utf8") {
      const bytes = new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
      return { ok: true, result: new TextDecoder().decode(bytes) };
    }
    return { ok: true, result: bin };
  } catch (e) {
    return { ok: false, error: "Invalid Base64 — " + e.message };
  }
}

export default function Base64CoderWrapper({ onBack }) {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({ text: "", ok: true });
  const [charset, setCharset] = useState("utf8");
  const [wrapLen, setWrapLen] = useState("none");
  const [urlIn, setUrlIn] = useState("");
  const [urlOut, setUrlOut] = useState("");
  const [fileRes, setFileRes] = useState(null);
  const [isDrag, setIsDrag] = useState(false);
  const [toast, setToast] = useState({ msg: "", show: false });

  const fileRef = useRef(null);
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      1800,
    );
  }, []);

  // live process
  useEffect(() => {
    if (!input.trim()) {
      setOutput({ text: "", ok: true });
      return;
    }
    const r =
      mode === "encode" ? encodeB64(input, charset) : decodeB64(input, charset);
    setOutput({ text: r.ok ? r.result : r.error, ok: r.ok });
  }, [input, mode, charset]);

  // url live
  useEffect(() => {
    if (!urlIn.trim()) {
      setUrlOut("");
      return;
    }
    try {
      setUrlOut(mode === "encode" ? btoa(urlIn) : atob(urlIn.trim()));
    } catch {
      setUrlOut("Invalid Base64");
    }
  }, [urlIn, mode]);

  const displayed = () => {
    if (!output.ok || !output.text) return output.text;
    if (wrapLen === "none") return output.text;
    const l = parseInt(wrapLen),
      chunks = [];
    for (let i = 0; i < output.text.length; i += l)
      chunks.push(output.text.slice(i, i + l));
    return chunks.join("\n");
  };

  const copy = async (t) => {
    if (!t) {
      showToast("Nothing to copy");
      return;
    }
    await navigator.clipboard.writeText(t);
    showToast("Copied");
  };

  const paste = async () => {
    try {
      setInput(await navigator.clipboard.readText());
    } catch {
      showToast("Clipboard denied");
    }
  };

  const download = () => {
    const t = displayed();
    if (!t) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([t], { type: "text/plain" }));
    a.download = mode === "encode" ? "encoded.b64" : "decoded.txt";
    a.click();
    showToast("Downloaded");
  };

  const swap = () => {
    setInput(output.ok ? output.text : "");
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    showToast("Swapped");
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURI = e.target.result;
      setFileRes({
        name: file.name,
        size: file.size,
        type: file.type,
        dataURI,
        b64: dataURI.split(",")[1],
      });
      showToast("File encoded");
    };
    reader.readAsDataURL(file);
  };

  const outText = displayed();
  const inBytes = new Blob([input]).size;
  const outBytes = output.ok ? new Blob([output.text]).size : 0;

  return (
    <>
      <style>{STYLES}</style>
      <div className="b64">
        {/* header */}
        <div className="b64-header">
          <div className="b64-logo">64</div>
          <div className="b64-title">Base64 Encoder / Decoder</div>
          <div className="b64-sub">encode · decode · files · urls</div>
        </div>

        {/* mode toggle */}
        <div className="b64-toggle">
          <button
            className={`b64-toggle-btn${mode === "encode" ? " on" : ""}`}
            onClick={() => setMode("encode")}
          >
            → Encode
          </button>
          <button
            className={`b64-toggle-btn${mode === "decode" ? " on" : ""}`}
            onClick={() => setMode("decode")}
          >
            ← Decode
          </button>
        </div>

        {/* main card */}
        <div className="b64-card">
          <textarea
            className="b64-area"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Type or paste text to encode…"
                : "Paste Base64 to decode…"
            }
            spellCheck={false}
          />

          <div className="b64-divider">
            <span className="b64-divider-label">
              {mode === "encode" ? "Base64 output" : "Decoded output"}
            </span>
            <select
              className="b64-nano-select"
              value={charset}
              onChange={(e) => setCharset(e.target.value)}
            >
              <option value="utf8">UTF-8</option>
              <option value="latin1">Latin-1</option>
            </select>
            <select
              className="b64-nano-select"
              value={wrapLen}
              onChange={(e) => setWrapLen(e.target.value)}
            >
              <option value="none">No wrap</option>
              <option value="64">Wrap 64</option>
              <option value="76">Wrap 76</option>
            </select>
            <button
              className="b64-mini-btn"
              onClick={() => copy(outText)}
            >
              Copy
            </button>
          </div>

          <div
            className={`b64-output-area${!output.text ? " empty" : output.ok ? " ok" : " err"}`}
          >
            {outText ||
              (mode === "encode"
                ? "Encoded output will appear here…"
                : "Decoded text will appear here…")}
          </div>
        </div>

        {/* actions */}
        <div className="b64-actions">
          <button
            className="b64-action-btn primary"
            onClick={swap}
          >
            ⇄ Swap
          </button>
          <button
            className="b64-action-btn"
            onClick={paste}
          >
            Paste
          </button>
          <button
            className="b64-action-btn"
            onClick={() => copy(outText)}
          >
            Copy
          </button>
          <button
            className="b64-action-btn"
            onClick={download}
          >
            Download
          </button>
          <button
            className="b64-action-btn"
            onClick={() => {
              setInput("");
              setOutput({ text: "", ok: true });
            }}
          >
            Clear
          </button>
          <button
            className="b64-action-btn"
            onClick={() => {
              setInput(
                mode === "encode"
                  ? '{"hello":"world","num":42}'
                  : "eyJoZWxsbyI6IndvcmxkIiwibnVtIjo0Mn0=",
              );
              showToast("Sample loaded");
            }}
          >
            Sample
          </button>
          {onBack && (
            <button
              className="b64-action-btn"
              style={{ marginLeft: "auto" }}
              onClick={onBack}
            >
              ← Back
            </button>
          )}
        </div>

        {/* stats */}
        {(input || output.text) && (
          <div className="b64-stats">
            <span>
              in <span className="b64-stat-val">{fmtBytes(inBytes)}</span>
            </span>
            <span>
              out <span className="b64-stat-val">{fmtBytes(outBytes)}</span>
            </span>
            {input &&
              output.ok &&
              output.text &&
              mode === "encode" &&
              inBytes > 0 && (
                <span>
                  overhead{" "}
                  <span className="b64-stat-val">
                    +{Math.round((outBytes / inBytes - 1) * 100)}%
                  </span>
                </span>
              )}
            <span>
              chars{" "}
              <span className="b64-stat-val">
                {(output.text || "").length.toLocaleString()}
              </span>
            </span>
          </div>
        )}

        {/* url quick encode */}
        <div className="b64-extra-card">
          <div
            className="b64-divider"
            style={{ padding: "0 14px" }}
          >
            <span className="b64-divider-label">Quick string</span>
            <button
              className="b64-mini-btn"
              onClick={() => copy(urlOut)}
            >
              Copy
            </button>
          </div>
          <div className="b64-url-inner">
            <input
              className="b64-url-input"
              placeholder={
                mode === "encode"
                  ? "Any string to encode…"
                  : "Base64 to decode…"
              }
              value={urlIn}
              onChange={(e) => setUrlIn(e.target.value)}
              spellCheck={false}
            />
            <div className="b64-url-sep" />
            <div className={`b64-url-out${!urlOut ? " empty" : ""}`}>
              {urlOut || "output…"}
            </div>
          </div>
        </div>

        {/* file encode */}
        <div className="b64-extra-card">
          <div
            className="b64-divider"
            style={{ padding: "0 14px" }}
          >
            <span className="b64-divider-label">File → Base64</span>
            <button
              className="b64-mini-btn"
              onClick={() => fileRef.current.click()}
            >
              Upload
            </button>
          </div>

          <div
            className={`b64-dropzone${isDrag ? " drag" : ""}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDrag(true);
            }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDrag(false);
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            <div style={{ fontSize: 20, opacity: 0.5 }}>📁</div>
            <div className="b64-drop-text">
              Drop any file or click to browse
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              handleFile(e.target.files[0]);
              e.target.value = "";
            }}
          />

          {fileRes && (
            <div className="b64-file-result">
              <div className="b64-file-name">📄 {fileRes.name}</div>
              <div className="b64-file-meta">
                {fileRes.type || "unknown"} · {fmtBytes(fileRes.size)} ·{" "}
                {fileRes.b64.length.toLocaleString()} chars
              </div>
              <div className="b64-file-prev">
                {fileRes.dataURI.slice(0, 200)}…
              </div>
              {fileRes.type.startsWith("image/") && (
                <img
                  src={fileRes.dataURI}
                  alt=""
                  style={{
                    maxWidth: "100%",
                    maxHeight: 100,
                    borderRadius: 6,
                    marginTop: 10,
                    border: "1px solid var(--border)",
                  }}
                />
              )}
              <div className="b64-file-btns">
                <button
                  className="b64-mini-btn"
                  onClick={() => copy(fileRes.b64)}
                >
                  Copy B64
                </button>
                <button
                  className="b64-mini-btn"
                  onClick={() => copy(fileRes.dataURI)}
                >
                  Copy Data URI
                </button>
                <button
                  className="b64-mini-btn"
                  onClick={() => setFileRes(null)}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="b64-toast show"
          style={{ display: "none" }}
        />
        <div className={`b64-toast${toast.show ? " show" : ""}`}>
          {toast.msg}
        </div>
      </div>
    </>
  );
}
