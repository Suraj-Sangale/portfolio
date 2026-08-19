import React, { useMemo, useState, useCallback } from "react";

/**
 * TemplateEmailSender
 * ---------------------------------------------------------------------------
 * Compose an email from a fixed set of predefined templates. The subject and
 * body are locked — the only parts a user can touch are the placeholder
 * fields the template itself declares (e.g. {{companyName}}). This keeps
 * wording consistent across every send while still letting each email be
 * personalized where it matters.
 *
 * Drop this file in as-is. Styles are plain CSS scoped with a unique prefix
 * and injected via a single <style> tag in this same file — no separate
 * .css/.module.css file needed, no build-step CSS module loader required.
 * ---------------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// 1. Predefined templates
//    Locked copy lives in `subject` / `body`. Anything wrapped in {{field}}
//    becomes an editable field, generated automatically — add a template
//    here and its form appears with no other code changes.
// ---------------------------------------------------------------------------
const TEMPLATES = [
  {
    id: "job-application",
    label: "Job Application",
    icon: "💼",
    seal: "01",
    to: "",
    subject: "Application for {{role}} — {{yourName}}",
    body:
      "Hello {{hiringManager}},\n\n" +
      "I'm writing to apply for the <b>{{role}}</b> position at <b>{{companyName}}</b>. " +
      "I work as a full stack developer with <b>React, Next.js, Node.js</b> and " +
      "<b>AWS</b>, and I'd welcome the chance to bring that to your team.\n\n" +
      "I've attached my <b>resume and portfolio</b> for your review. Happy to " +
      "share more detail on anything relevant.",
    fields: {
      yourName:      { label: "Your name",      placeholder: "Suraj Sangale",         default: "Suraj Sangale",         required: true  },
      role:          { label: "Role",            placeholder: "Full Stack Developer",  default: "Full Stack Developer",  required: true  },
      companyName:   { label: "Company",         placeholder: "Acme Technologies",     default: "",                      required: true  },
      hiringManager: { label: "Hiring manager",  placeholder: "Hiring Team",           default: "Hiring Team",           required: false },
    },
  },
  {
    id: "follow-up",
    label: "Follow-up",
    icon: "🔁",
    seal: "02",
    to: "",
    subject: "Following up — {{role}} application",
    body:
      "Hello {{hiringManager}},\n\n" +
      "I wanted to follow up on my application for the {{role}} role, " +
      "sent on {{sentDate}}. I remain very interested in {{companyName}} " +
      "and happy to provide anything further that's useful.",
    fields: {
      role:          { label: "Role",                placeholder: "Full Stack Developer", default: "Full Stack Developer", required: true  },
      companyName:   { label: "Company",             placeholder: "Acme Technologies",    default: "",                    required: true  },
      hiringManager: { label: "Hiring manager",      placeholder: "Hiring Team",          default: "Hiring Team",         required: false },
      sentDate:      { label: "Original send date",  placeholder: "12 Aug",               default: "",                    required: true  },
    },
  },
  {
    id: "thank-you",
    label: "Thank You",
    icon: "🙏",
    seal: "03",
    to: "",
    subject: "Thank you — {{role}} interview",
    body:
      "Hello {{interviewerName}},\n\n" +
      "Thank you for taking the time to speak with me about the {{role}} " +
      "role at {{companyName}}. I enjoyed our conversation, particularly " +
      "{{highlight}}, and I'm even more interested in joining the team.\n\n" +
      "Please let me know if you need anything else from my side.",
    fields: {
      role:            { label: "Role",                  placeholder: "Full Stack Developer",              default: "Full Stack Developer",              required: true  },
      companyName:     { label: "Company",               placeholder: "Acme Technologies",                 default: "",                                  required: true  },
      interviewerName: { label: "Interviewer",           placeholder: "Priya",                             default: "",                                  required: false },
      highlight:       { label: "Something to reference", placeholder: "the team's approach to code review", default: "the team's approach to code review", required: false },
    },
  },
];

/** Seed values state from a template's field defaults */
function getDefaults(template) {
  return Object.fromEntries(
    Object.entries(template.fields).map(([key, cfg]) => [key, cfg.default ?? ""])
  );
}

const PLACEHOLDER_RE = /{{\s*([\w]+)\s*}}/g;

function fillTemplate(text, values) {
  return text.replace(PLACEHOLDER_RE, (_, key) => {
    const v = values[key];
    return v && v.trim() ? v : `▢${key}▢`;
  });
}

export default function TemplateEmailSender() {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [toAddress, setToAddress] = useState("");
  const [values, setValues] = useState(() => getDefaults(TEMPLATES[0]));
  const [touched, setTouched] = useState({});
  const [sendState, setSendState] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const template = useMemo(
    () => TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0],
    [templateId]
  );

  const fieldEntries = useMemo(
    () => Object.entries(template.fields),
    [template]
  );

  const handleSelectTemplate = useCallback((id) => {
    const tpl = TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
    setTemplateId(id);
    setValues(getDefaults(tpl));
    setTouched({});
    setSendState("idle");
    setErrorMsg("");
  }, []);

  const handleFieldChange = useCallback((key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleFieldBlur = useCallback((key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const missingRequired = fieldEntries
    .filter(([key, cfg]) => cfg.required && !values[key]?.trim())
    .map(([key]) => key);

  const canSend = missingRequired.length === 0 && toAddress.trim().length > 0;

  const filledSubject = fillTemplate(template.subject, values);
  const filledBody = fillTemplate(template.body, values);

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      setTouched(
        Object.fromEntries(fieldEntries.map(([key]) => [key, true]))
      );
      if (!canSend) return;

      setSendState("sending");
      setErrorMsg("");

      try {
        const res = await fetch("/api/sendTemplateMail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: toAddress, subject: filledSubject, body: filledBody }),
        });
        const data = await res.json();
        if (data.status) {
          setSendState("success");
          window.setTimeout(() => setSendState("idle"), 3500);
        } else {
          setSendState("error");
          setErrorMsg(data.message || "Something went wrong.");
        }
      } catch (err) {
        setSendState("error");
        setErrorMsg("Network error. Please try again.");
      }
    },
    [fieldEntries, canSend, toAddress, filledSubject, filledBody]
  );

  return (
    <div className="tes-root">
      <style>{CSS}</style>

      {/* Animated background orbs */}
      <div className="tes-orb tes-orb-1" aria-hidden="true" />
      <div className="tes-orb tes-orb-2" aria-hidden="true" />
      <div className="tes-orb tes-orb-3" aria-hidden="true" />

      <div className="tes-wrap">
      <header className="tes-header">
        <div className="tes-header-badge">
          <span className="tes-header-dot" />
          Email Composer
        </div>
        <h1 className="tes-title">
          Send from a {" "}
          <span className="tes-title-accent">Template</span>
        </h1>
        <p className="tes-sub">
          Wording stays locked. Fill in only what changes — and send directly from your Gmail.
        </p>
      </header>

      <div className="tes-layout">
        {/* Template selector */}
        <nav className="tes-stack" aria-label="Choose a template">
          <p className="tes-stack-label">Choose template</p>
          {TEMPLATES.map((t) => {
            const active = t.id === template.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`tes-card${active ? " tes-card--active" : ""}`}
                onClick={() => handleSelectTemplate(t.id)}
                aria-pressed={active}
              >
                <span className="tes-card-icon">{t.icon}</span>
                <span className="tes-card-body">
                  <span className="tes-card-label">{t.label}</span>
                  <span className="tes-card-preview">{t.subject.replace(PLACEHOLDER_RE, "…")}</span>
                </span>
                {active && <span className="tes-card-pip" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>

        {/* -------------------------------------------------------------- */}
        {/* Composer                                                       */}
        {/* -------------------------------------------------------------- */}
        <form className="tes-composer" onSubmit={handleSend}>
          <div className="tes-field-row">
            <label className="tes-label" htmlFor="tes-to">To</label>
            <input
              id="tes-to"
              type="email"
              required
              className="tes-input"
              placeholder="recruiter@company.com"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            />
          </div>

          <div className="tes-locked-row">
            <span className="tes-locked-tag">Locked</span>
            <span className="tes-locked-copy">
              Subject &amp; body wording come from the “{template.label}” template.
            </span>
          </div>

          {fieldEntries.length > 0 && (
            <div className="tes-fields">
              {fieldEntries.map(([key, cfg]) => {
                const showError = touched[key] && cfg.required && !values[key]?.trim();
                return (
                  <div className="tes-field-row" key={key}>
                    <label className="tes-label" htmlFor={`tes-field-${key}`}>
                      {cfg.label}
                      {cfg.required && <span className="tes-required">*</span>}
                    </label>
                    <input
                      id={`tes-field-${key}`}
                      className={`tes-input tes-input--fill${showError ? " tes-input--error" : ""}`}
                      placeholder={cfg.placeholder}
                      value={values[key] || ""}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      onBlur={() => handleFieldBlur(key)}
                    />
                    {showError && <span className="tes-error">Required</span>}
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="submit"
            className={`tes-send${sendState === "success" ? " tes-send--success" : ""}${sendState === "error" ? " tes-send--error" : ""}`}
            disabled={!canSend || sendState === "sending"}
          >
            {sendState === "sending" && <span className="tes-spinner" aria-hidden="true" />}
            {sendState === "idle" && "Send email →"}
            {sendState === "sending" && "Sending…"}
            {sendState === "success" && "✓ Email sent!"}
            {sendState === "error" && "✗ Failed — retry"}
          </button>
          {sendState === "error" && errorMsg && (
            <span className="tes-send-error-msg">{errorMsg}</span>
          )}
        </form>

        {/* Live preview */}
        <aside className="tes-preview" aria-label="Email preview">
          <div className="tes-preview-header">
            <div className="tes-preview-dots"><span /><span /><span /></div>
            <span className="tes-preview-title">Preview</span>
          </div>
          <div className="tes-preview-body">
            <div className="tes-preview-meta">
              <div className="tes-meta-row">
                <span className="tes-meta-key">To</span>
                <span className="tes-meta-val">{toAddress || <em>—</em>}</span>
              </div>
              <div className="tes-meta-row">
                <span className="tes-meta-key">Subject</span>
                <span className="tes-meta-val tes-meta-subject">{filledSubject}</span>
              </div>
            </div>
            <div className="tes-preview-divider" />
            <pre className="tes-preview-text">{filledBody}</pre>
          </div>
        </aside>
      </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Styles — dark glassmorphism premium theme
// ---------------------------------------------------------------------------
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');

.tes-root {
  --bg:        #0a0a0f;
  --surface:   rgba(255,255,255,0.04);
  --surface-2: rgba(255,255,255,0.07);
  --border:    rgba(255,255,255,0.09);
  --border-2:  rgba(255,255,255,0.16);
  --text:      #e8e8f0;
  --text-soft: #7a7a9a;
  --accent:    #e05a2b;
  --accent-2:  #ff7c52;
  --accent-glow: rgba(224,90,43,0.35);
  --green:     #22c55e;
  --red:       #ef4444;
  --sans:      'Inter', system-ui, sans-serif;
  // --display:   'Syne', system-ui, sans-serif;
  --radius:    14px;
  --radius-sm: 9px;

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  overflow-x: hidden;
}
.tes-root *, .tes-root *::before, .tes-root *::after { box-sizing: border-box; margin: 0; }

/* ── Animated orbs ───────────────────────────────────────────── */
.tes-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  pointer-events: none;
  animation: tes-float 14s ease-in-out infinite alternate;
}
.tes-orb-1 {
  width: 650px; height: 650px;
  background: radial-gradient(circle, #e05a2b 0%, transparent 70%);
  top: -220px; left: -180px;
}
.tes-orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  bottom: -120px; right: -120px;
  animation-duration: 18s; animation-delay: -6s;
}
.tes-orb-3 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, #0ea5e9 0%, transparent 70%);
  top: 45%; left: 48%;
  animation-duration: 22s; animation-delay: -10s;
}
@keyframes tes-float {
  0%   { transform: translate(0,0) scale(1); }
  100% { transform: translate(45px,35px) scale(1.1); }
}

/* ── Wrap ────────────────────────────────────────────────────── */
.tes-wrap {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 6rem;
}

/* ── Header ──────────────────────────────────────────────────── */
.tes-header { margin-bottom: 3.5rem; }
.tes-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-2);
  background: rgba(224,90,43,0.1);
  border: 1px solid rgba(224,90,43,0.22);
  border-radius: 100px;
  padding: 0.3rem 0.9rem;
  margin-bottom: 1.3rem;
}
.tes-header-dot {
  width: 6px; height: 6px;
  background: var(--accent-2);
  border-radius: 50%;
  animation: tes-pulse 2.2s ease-in-out infinite;
}
@keyframes tes-pulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.35; transform: scale(0.7); }
}
.tes-title {
  font-family: var(--display);
  font-size: clamp(2.6rem, 5.5vw, 4rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #fff;
  margin-bottom: 1rem;
}
.tes-title-accent {
  background: linear-gradient(125deg, var(--accent) 0%, var(--accent-2) 55%, #ffb347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.tes-sub {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-soft);
  max-width: 500px;
}

/* ── Grid layout ─────────────────────────────────────────────── */
.tes-layout {
  display: grid;
  grid-template-columns: 230px 1fr 1fr;
  gap: 1.25rem;
  align-items: start;
}
@media (max-width: 920px) {
  .tes-layout { grid-template-columns: 1fr 1fr; }
  .tes-stack  { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3,1fr); gap: 0.75rem; }
  .tes-stack-label { grid-column: 1 / -1; }
}
@media (max-width: 580px) {
  .tes-layout { grid-template-columns: 1fr; }
  .tes-stack  { grid-template-columns: 1fr; }
}

/* ── Template cards ──────────────────────────────────────────── */
.tes-stack-label {
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--text-soft);
  margin-bottom: 0.3rem;
  padding-left: 0.2rem;
}
.tes-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.9rem;
  cursor: pointer;
  font-family: var(--sans);
  color: var(--text);
  transition: all 0.22s ease;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
}
.tes-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.22s;
}
.tes-card:hover { border-color: var(--border-2); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.35); }
.tes-card:hover::after { opacity: 1; }
.tes-card--active {
  border-color: var(--accent);
  background: rgba(224,90,43,0.09);
  box-shadow: 0 0 0 1px var(--accent), 0 10px 36px var(--accent-glow);
}
.tes-card--active::after { opacity: 1; }
.tes-card-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.tes-card-body { display: flex; flex-direction: column; gap: 0.18rem; min-width: 0; flex: 1; }
.tes-card-label { font-size: 0.87rem; font-weight: 600; color: #fff; }
.tes-card-preview {
  font-size: 0.72rem;
  color: var(--text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tes-card-pip {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--accent) 0%, var(--accent-2) 100%);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

/* ── Composer panel ──────────────────────────────────────────── */
.tes-composer {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 4px 48px rgba(0,0,0,0.35);
}
.tes-composer-head {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding-bottom: 1.1rem;
  border-bottom: 1px solid var(--border);
}
.tes-composer-icon {
  font-size: 1.5rem;
  width: 46px; height: 46px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  border-radius: 11px;
  flex-shrink: 0;
}
.tes-composer-label {
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.tes-composer-name {
  font-size: 0.97rem;
  font-weight: 600;
  color: #fff;
  margin-top: 0.12rem;
}

/* ── Form fields ─────────────────────────────────────────────── */
.tes-field-group { display: flex; flex-direction: column; gap: 0.4rem; }
.tes-flabel {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.tes-flabel-icon { font-style: normal; }
.tes-req { color: var(--accent-2); margin-left: 0.12rem; }
.tes-input {
  width: 100%;
  font-family: var(--sans);
  font-size: 0.93rem;
  color: var(--text);
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.68rem 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  -webkit-appearance: none;
}
.tes-input::placeholder { color: rgba(122,122,154,0.65); }
.tes-input:focus {
  border-color: var(--accent);
  background: rgba(224,90,43,0.06);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.tes-input--err { border-color: var(--red); }
.tes-input--err:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.22); }
.tes-errmsg { font-size: 0.72rem; color: #f87171; font-weight: 500; }

/* ── Locked notice ───────────────────────────────────────────── */
.tes-locked {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.9rem;
  background: rgba(255,255,255,0.025);
  border: 1px dashed rgba(255,255,255,0.1);
  border-radius: var(--radius-sm);
}
.tes-locked-pill {
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-soft);
  background: rgba(255,255,255,0.07);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 0.15rem 0.55rem;
  white-space: nowrap;
  flex-shrink: 0;
}
.tes-locked-text { font-size: 0.78rem; color: var(--text-soft); line-height: 1.45; }
.tes-locked-text strong { color: var(--text); font-weight: 600; }

/* ── Fields block ────────────────────────────────────────────── */
.tes-fields {
  display: flex; flex-direction: column; gap: 0.9rem;
  padding: 1rem 1.1rem;
  background: rgba(255,255,255,0.025);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.tes-fields-title {
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-2);
}

/* ── Send button ─────────────────────────────────────────────── */
.tes-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  align-self: flex-start;
  font-family: var(--sans);
  font-size: 0.93rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #fff;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.78rem 1.8rem;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 4px 22px var(--accent-glow);
  position: relative;
  overflow: hidden;
}
.tes-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.22s;
}
.tes-btn:hover:not(:disabled)::before { opacity: 1; }
.tes-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px var(--accent-glow); }
.tes-btn:active:not(:disabled) { transform: translateY(1px); }
.tes-btn:disabled { background: rgba(255,255,255,0.08); box-shadow: none; cursor: not-allowed; color: var(--text-soft); }
.tes-btn--ok   { background: linear-gradient(135deg, #15803d, var(--green)) !important; box-shadow: 0 4px 22px rgba(34,197,94,0.35) !important; }
.tes-btn--fail { background: linear-gradient(135deg, #991b1b, var(--red)) !important; box-shadow: 0 4px 22px rgba(239,68,68,0.35) !important; }

.tes-spin {
  width: 0.9rem; height: 0.9rem;
  border: 2px solid rgba(255,255,255,0.28);
  border-top-color: #fff;
  border-radius: 50%;
  animation: tes-rotate 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes tes-rotate { to { transform: rotate(360deg); } }

.tes-errbanner {
  font-size: 0.78rem;
  color: #fca5a5;
  background: rgba(239,68,68,0.09);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.85rem;
  line-height: 1.5;
}

/* ── Preview panel ───────────────────────────────────────────── */
.tes-preview {
  position: sticky;
  top: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 4px 48px rgba(0,0,0,0.35);
}
.tes-preview-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1.1rem;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid var(--border);
}
.tes-preview-dots { display: flex; gap: 0.38rem; }
.tes-preview-dots span {
  width: 10px; height: 10px; border-radius: 50%;
}
.tes-preview-dots span:nth-child(1) { background: rgba(239,68,68,0.65); }
.tes-preview-dots span:nth-child(2) { background: rgba(251,191,36,0.65); }
.tes-preview-dots span:nth-child(3) { background: rgba(34,197,94,0.65); }
.tes-preview-title {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.tes-preview-body { padding: 1.3rem; }
.tes-preview-meta { display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 1rem; }
.tes-meta-row { display: flex; gap: 0.65rem; align-items: flex-start; }
.tes-meta-key {
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-soft);
  min-width: 3.8rem;
  padding-top: 0.15rem;
  flex-shrink: 0;
}
.tes-meta-val { font-size: 0.86rem; color: var(--text); line-height: 1.4; word-break: break-all; }
.tes-meta-subject { font-weight: 600; color: #fff; word-break: normal; }
.tes-meta-val em { color: var(--text-soft); font-style: normal; }
.tes-preview-divider { height: 1px; background: var(--border); margin-bottom: 1.1rem; }
.tes-preview-text {
  font-family: var(--sans);
  font-size: 0.85rem;
  line-height: 1.8;
  white-space: pre-wrap;
  color: rgba(232,232,240,0.75);
  word-break: break-word;
}
`;
