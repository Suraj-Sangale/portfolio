import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

/**
 * TemplateEmailSender
 * ---------------------------------------------------------------------------
 * Compose and dispatch customized corporate emails and cover letters directly
 * from your Gmail, with pre-filled company intelligence and customizable templates.
 * ---------------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// 1. Cover letter presets
// ---------------------------------------------------------------------------
const COVER_LETTER_PRESETS = {
  fullstack: {
    label: "Full Stack (React, Next.js, Node)",
    icon: "🚀",
    text: "Throughout my career as a Full Stack Developer, I have focused on building resilient, high-performance web applications using React, Next.js, and Node.js. I have designed robust APIs, implemented optimized databases, and deployed cloud services. I thrive in teams that prioritize user delight, clean architecture, and velocity.",
  },
  frontend: {
    label: "Frontend & UI/UX Specialist",
    icon: "🎨",
    text: "My core expertise lies in designing responsive, accessible, and interactive user interfaces with React, Next.js, and modern CSS/animation tools. I care deeply about performance optimization, micro-interactions, responsive design systems, and crafting memorable digital experiences.",
  },
  backend: {
    label: "Backend & Systems Engineer",
    icon: "⚡",
    text: "I bring strong foundations in server-side engineering, microservices, REST/GraphQL API design, and cloud deployments with Node.js and AWS. I focus on writing reliable, clean code, automating development workflows, and ensuring systems scale gracefully under demanding production workloads.",
  },
  general: {
    label: "Adaptive & Mission-Driven",
    icon: "💡",
    text: "I am specifically drawn to your engineering initiatives and products. I bring a proactive problem-solving mindset, rapid learning agility, and a strong commitment to team collaboration and craftsmanship.",
  },
};

// ---------------------------------------------------------------------------
// 2. Predefined templates
// ---------------------------------------------------------------------------
const TEMPLATES = [
  {
    id: "cover-letter",
    label: "Cover Letter",
    icon: "📜",
    seal: "01",
    to: "",
    subject: "Application & Cover Letter for {{role}} — {{yourName}}",
    body:
      "Dear {{hiringManager}},\n\n" +
      "I am writing to express my strong enthusiasm and application for the <b>{{role}}</b> position at <b>{{companyName}}</b>. " +
      "With hands-on expertise building scalable, modern web applications using <b>React, Next.js, Node.js, and cloud architectures</b>, " +
      "I am eager to contribute to {{companyName}}'s engineering team and mission.\n\n" +
      "Throughout my development journey, I have prioritized writing clean, maintainable code, designing resilient API backends, " +
      "and delivering seamless, high-performance user interfaces. I pride myself on solving complex technical challenges proactively and communicating transparently.\n\n" +
      "{{customCoverParagraph}}\n\n" +
      "I have attached my <b>comprehensive resume</b> for your review. You can also inspect my live projects and code on my portfolio. " +
      "I would welcome the opportunity to discuss how my skill set and enthusiasm align with {{companyName}}'s goals.\n\n" +
      "Thank you for your time and consideration.\n\n" +
      "Warm regards,\n" +
      "<b>{{yourName}}</b>",
    fields: {
      yourName:             { label: "Your name",                     placeholder: "Suraj Sangale",                 default: "Suraj Sangale",                 required: true  },
      role:                 { label: "Target Role",                   placeholder: "Full Stack Developer",          default: "Full Stack Developer",          required: true  },
      companyName:          { label: "Company",                       placeholder: "Acme Technologies",             default: "",                              required: true  },
      hiringManager:        { label: "Hiring Manager / Team",         placeholder: "Hiring Team",                   default: "Hiring Team",                   required: false },
      customCoverParagraph: {
        label: "Cover Letter Focus / Highlight",
        placeholder: "Detail your key strengths, motivation for this company, and relevant achievements...",
        default: "Throughout my career as a Full Stack Developer, I have focused on building resilient, high-performance web applications using React, Next.js, and Node.js. I have designed robust APIs, implemented optimized databases, and deployed cloud services. I thrive in teams that prioritize user delight, clean architecture, and velocity.",
        required: false,
        multiline: true,
      },
    },
  },
  {
    id: "job-application",
    label: "Job Application",
    icon: "💼",
    seal: "02",
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
    seal: "03",
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
    seal: "04",
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
  if (!text) return "";
  return text.replace(PLACEHOLDER_RE, (_, key) => {
    const v = values[key];
    return v && v.trim() ? v : `▢${key}▢`;
  });
}

export default function TemplateEmailSender() {
  const router = useRouter();

  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [toAddress, setToAddress] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [isSubjectCustomized, setIsSubjectCustomized] = useState(false);
  const [values, setValues] = useState(() => getDefaults(TEMPLATES[0]));
  const [touched, setTouched] = useState({});
  const [sendState, setSendState] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [includeCoverLetter, setIncludeCoverLetter] = useState(false);
  const [coverLetterPreset, setCoverLetterPreset] = useState("fullstack");
  const [previewMode, setPreviewMode] = useState("visual"); // visual | raw

  // Sync incoming query parameters from Company Contacts Finder
  useEffect(() => {
    if (!router.isReady) return;
    const { to, company, role, template: tplParam, coverletter, subject } = router.query;

    if (to && typeof to === "string") {
      setToAddress(to);
    }

    if (subject && typeof subject === "string") {
      setCustomSubject(subject);
      setIsSubjectCustomized(true);
    }

    if (tplParam && typeof tplParam === "string" && TEMPLATES.some((t) => t.id === tplParam)) {
      setTemplateId(tplParam);
    } else if (coverletter === "true" || coverletter === "1") {
      setTemplateId("cover-letter");
    }

    if (company && typeof company === "string") {
      setValues((prev) => ({
        ...prev,
        companyName: company,
        ...(role && typeof role === "string" ? { role } : {}),
      }));
    }
  }, [router.isReady, router.query]);

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
    setIsSubjectCustomized(false);
    setCustomSubject("");
    setValues((prev) => ({
      ...getDefaults(tpl),
      ...(prev.companyName ? { companyName: prev.companyName } : {}),
      ...(prev.role ? { role: prev.role } : {}),
      ...(prev.yourName ? { yourName: prev.yourName } : {}),
      ...(prev.hiringManager && prev.hiringManager !== "Hiring Team" ? { hiringManager: prev.hiringManager } : {}),
    }));
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

  const handleApplyCoverPreset = (key) => {
    setCoverLetterPreset(key);
    const p = COVER_LETTER_PRESETS[key];
    if (p) {
      setValues((prev) => ({
        ...prev,
        customCoverParagraph: p.text,
      }));
    }
  };

  // Subject management
  const autoSubject = fillTemplate(template.subject, values);
  const effectiveSubject = isSubjectCustomized ? customSubject : autoSubject;

  const handleSubjectChange = (e) => {
    setCustomSubject(e.target.value);
    setIsSubjectCustomized(true);
  };

  const handleResetSubject = () => {
    setIsSubjectCustomized(false);
    setCustomSubject("");
  };

  const missingRequired = fieldEntries
    .filter(([key, cfg]) => cfg.required && !values[key]?.trim())
    .map(([key]) => key);

  const canSend = missingRequired.length === 0 && toAddress.trim().length > 0 && effectiveSubject.trim().length > 0;

  let filledBody = fillTemplate(template.body, values);

  // If user toggles cover letter addendum on other short templates
  if (includeCoverLetter && template.id !== "cover-letter") {
    const presetSnippet = COVER_LETTER_PRESETS[coverLetterPreset]?.text || "";
    filledBody = `${filledBody}\n\n--- COVER LETTER HIGHLIGHT ---\n${fillTemplate(presetSnippet, values)}`;
  }

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
          body: JSON.stringify({
            to: toAddress,
            subject: effectiveSubject,
            body: filledBody,
            companyName: values.companyName || router.query.company || "",
            role: values.role || "",
            yourName: values.yourName || "Suraj Sangale",
          }),
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
    [fieldEntries, canSend, toAddress, effectiveSubject, filledBody]
  );

  return (
    <div className="tes-root mt-8">
      <style>{CSS}</style>

      {/* Animated background orbs */}
      <div className="tes-orb tes-orb-1" aria-hidden="true" />
      <div className="tes-orb tes-orb-2" aria-hidden="true" />
      <div className="tes-orb tes-orb-3" aria-hidden="true" />

      <div className="tes-wrap">
        <header className="tes-header">
          {/* <div className="tes-header-top-row">
            <Link href="/company-contacts" className="tes-breadcrumb-link">
              ← Back to Company Contacts
            </Link>
          </div> */}
          {/* <div className="tes-header-badge">
            <span className="tes-header-dot" />
            Corporate Email &amp; Cover Letter Portal
          </div> */}
          <h1 className="tes-title">
            Send from a <span className="tes-title-accent">Template &amp; Cover Letter</span>
          </h1>
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
            {/* Banner if redirected with company query */}
            {router.query.company && (
              <div className="tes-company-banner">
                <div className="tes-company-banner-text">
                  <span className="tes-company-icon">🏢</span>
                  <span>
                    Sending to <strong>{router.query.company}</strong>
                    {toAddress && (
                      <span> (<span className="tes-company-email">{toAddress}</span>)</span>
                    )}
                  </span>
                </div>
                <Link href="/company-contacts" className="tes-company-back-link">
                  Scan another company
                </Link>
              </div>
            )}

            <div className="tes-field-row">
              <label className="tes-label" htmlFor="tes-to">
                Recipient Email <span className="tes-required">*</span>
              </label>
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

            <div className="tes-field-row">
              <div className="tes-label-row">
                <label className="tes-label" htmlFor="tes-subject">
                  Email Subject <span className="tes-required">*</span>
                </label>
                {isSubjectCustomized ? (
                  <button
                    type="button"
                    className="tes-reset-subject-btn"
                    onClick={handleResetSubject}
                    title="Reset to template auto-generated subject"
                  >
                    ↺ Reset to Template Default
                  </button>
                ) : (
                  <span className="tes-subject-hint">Auto-generated • Edit to customize</span>
                )}
              </div>
              <input
                id="tes-subject"
                type="text"
                required
                className="tes-input tes-input--subject"
                placeholder="e.g. Application for Full Stack Developer — Suraj Sangale"
                value={effectiveSubject}
                onChange={handleSubjectChange}
              />
            </div>

            <div className="tes-locked-row">
              <span className="tes-locked-tag">Active Template</span>
              <span className="tes-locked-copy">
                “{template.label}” template structure loaded. Fill in the fields below.
              </span>
            </div>

            {/* Cover Letter Preset Selector (when Cover Letter template is active) */}
            {template.id === "cover-letter" && (
              <div className="tes-cover-panel">
                <div className="tes-cover-header">
                  <span className="tes-cover-title">📜 Cover Letter Focus Presets</span>
                  <span className="tes-cover-sub">Click a preset to insert a tailored pitch</span>
                </div>
                <div className="tes-presets-row">
                  {Object.entries(COVER_LETTER_PRESETS).map(([key, p]) => (
                    <button
                      key={key}
                      type="button"
                      className={`tes-preset-btn ${coverLetterPreset === key ? "tes-preset-btn--active" : ""}`}
                      onClick={() => handleApplyCoverPreset(key)}
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter Optional Addendum (when on other templates) */}
            {template.id !== "cover-letter" && (
              <div className="tes-cover-toggle-card">
                <label className="tes-checkbox-label">
                  <input
                    type="checkbox"
                    checked={includeCoverLetter}
                    onChange={(e) => setIncludeCoverLetter(e.target.checked)}
                    className="tes-checkbox"
                  />
                  <span className="tes-checkbox-text">
                    <strong>Include Cover Letter Addendum</strong> in this email
                  </span>
                </label>
                {includeCoverLetter && (
                  <div className="tes-presets-row tes-presets-mt">
                    {Object.entries(COVER_LETTER_PRESETS).map(([key, p]) => (
                      <button
                        key={key}
                        type="button"
                        className={`tes-preset-btn ${coverLetterPreset === key ? "tes-preset-btn--active" : ""}`}
                        onClick={() => setCoverLetterPreset(key)}
                      >
                        <span>{p.icon}</span>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Editable template fields */}
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
                      {cfg.multiline ? (
                        <textarea
                          id={`tes-field-${key}`}
                          rows={4}
                          className={`tes-input tes-input--fill tes-textarea${showError ? " tes-input--error" : ""}`}
                          placeholder={cfg.placeholder}
                          value={values[key] || ""}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          onBlur={() => handleFieldBlur(key)}
                        />
                      ) : (
                        <input
                          id={`tes-field-${key}`}
                          className={`tes-input tes-input--fill${showError ? " tes-input--error" : ""}`}
                          placeholder={cfg.placeholder}
                          value={values[key] || ""}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          onBlur={() => handleFieldBlur(key)}
                        />
                      )}
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
              {sendState === "idle" && "Send email with Resume & Cover Letter →"}
              {sendState === "sending" && "Sending…"}
              {sendState === "success" && "✓ Email sent successfully!"}
              {sendState === "error" && "✗ Failed — retry"}
            </button>
            {sendState === "error" && errorMsg && (
              <span className="tes-send-error-msg">{errorMsg}</span>
            )}
          </form>

          {/* Live preview matching the visual email template */}
          <aside className="tes-preview" aria-label="Email preview">
            <div className="tes-preview-header">
              <div className="tes-preview-dots"><span /><span /><span /></div>
              <span className="tes-preview-title">Email Preview</span>
              <div className="tes-preview-mode-switch">
                <button
                  type="button"
                  className={`tes-mode-btn ${previewMode === "visual" ? "tes-mode-btn--active" : ""}`}
                  onClick={() => setPreviewMode("visual")}
                >
                  ✉ Visual Card
                </button>
                <button
                  type="button"
                  className={`tes-mode-btn ${previewMode === "raw" ? "tes-mode-btn--active" : ""}`}
                  onClick={() => setPreviewMode("raw")}
                >
                  📄 Raw Text
                </button>
              </div>
            </div>

            <div className="tes-preview-body">
              <div className="tes-preview-meta">
                <div className="tes-meta-row">
                  <span className="tes-meta-key">To</span>
                  <span className="tes-meta-val">{toAddress || <em>(Enter recipient email)</em>}</span>
                </div>
                <div className="tes-meta-row">
                  <span className="tes-meta-key">Subject</span>
                  <span className="tes-meta-val tes-meta-subject">{effectiveSubject || <em>(No subject)</em>}</span>
                </div>
                <div className="tes-meta-row">
                  <span className="tes-meta-key">Attachment</span>
                  <span className="tes-meta-val" style={{ color: "#34d399", fontSize: "0.8rem" }}>
                    📎 Suraj_Sangale_Resume.pdf (Included Automatically)
                  </span>
                </div>
              </div>

              <div className="tes-preview-divider" />

              {previewMode === "visual" ? (
                <div className="tes-mockup-wrapper">
                  <div className="tes-mockup-card">
                    {/* Header with background-image header-bg.jpg & subject overlay */}
                    <div className="tes-mockup-header">
                      <div className="tes-mockup-header-content">
                        <span className="tes-mockup-header-tag">
                          FROM {(values.yourName || "SURAJ SANGALE").toUpperCase()}
                        </span>
                        <h2 className="tes-mockup-header-title">
                          {effectiveSubject || "Application for Full Stack Developer Position"}
                        </h2>
                        {(values.companyName || router.query.company) && (
                          <div className="tes-mockup-header-company">
                            At <span>{values.companyName || router.query.company}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email Content Body */}
                    <div className="tes-mockup-body">
                      <div className="tes-mockup-paragraphs">
                        {filledBody
                          .split(/\n\s*\n/)
                          .map((p) => p.trim())
                          .filter(Boolean)
                          .map((p, idx) => (
                            <p
                              key={idx}
                              className="tes-mockup-p"
                              dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, "<br/>") }}
                            />
                          ))}
                      </div>

                      {/* Signature Profile Box */}
                      <div className="tes-mockup-signature">
                        <div className="tes-mockup-sig-left">
                          <div className="tes-mockup-profile">
                            <div className="tes-mockup-avatar">
                              {(values.yourName || "Suraj Sangale").charAt(0) || "S"}
                            </div>
                            <div>
                              <div className="tes-mockup-name">{values.yourName || "Suraj Sangale"}</div>
                              <div className="tes-mockup-role">{values.role || "Full-Stack Developer"}</div>
                            </div>
                          </div>
                          <div className="tes-mockup-pills">
                            <span className="tes-mockup-pill">React.js</span>
                            <span className="tes-mockup-pill">Next.js</span>
                            <span className="tes-mockup-pill">Node.js</span>
                            <span className="tes-mockup-pill">AWS</span>
                          </div>
                        </div>

                        <div className="tes-mockup-sig-divider" />

                        <div className="tes-mockup-sig-right">
                          <div className="tes-mockup-contact-item">
                            <span className="tes-mockup-contact-icon tes-mockup-contact-icon--orange">📞</span>
                            <span className="tes-mockup-contact-text">+91 70395 29129</span>
                          </div>
                          <div className="tes-mockup-contact-item">
                            <span className="tes-mockup-contact-icon tes-mockup-contact-icon--orange">✉</span>
                            <span className="tes-mockup-contact-text">surajdsangale@gmail.com</span>
                          </div>
                          <div className="tes-mockup-contact-item">
                            <span className="tes-mockup-contact-icon tes-mockup-contact-icon--blue">🌐</span>
                            <span className="tes-mockup-contact-text">surajsangale.vercel.app</span>
                          </div>
                          <div className="tes-mockup-contact-item">
                            <span className="tes-mockup-contact-icon tes-mockup-contact-icon--linkedin">in</span>
                            <span className="tes-mockup-contact-text">linkedin.com/in/suraj-sangale</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Cards */}
                      <div className="tes-mockup-actions">
                        {/* Resume Card */}
                        <a
                          href="https://surajsangale.vercel.app/Suraj_full_stack_developer.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tes-mockup-action-card tes-mockup-action-card--resume"
                        >
                          <div className="tes-mockup-action-left">
                            <div className="tes-mockup-action-icon tes-mockup-action-icon--resume">
                              📄
                            </div>
                            <div>
                              <div className="tes-mockup-action-title">Resume</div>
                              <div className="tes-mockup-action-sub">suraj-sangale-resume.pdf</div>
                            </div>
                          </div>
                          <div className="tes-mockup-action-btn tes-mockup-action-btn--resume">
                            📥
                          </div>
                        </a>

                        {/* Portfolio Card */}
                        <a
                          href="https://surajsangale.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tes-mockup-action-card tes-mockup-action-card--portfolio"
                        >
                          <div className="tes-mockup-action-left">
                            <div className="tes-mockup-action-icon tes-mockup-action-icon--portfolio">
                              🔗
                            </div>
                            <div>
                              <div className="tes-mockup-action-title">Portfolio</div>
                              <div className="tes-mockup-action-sub">surajsangale.vercel.app</div>
                            </div>
                          </div>
                          <div className="tes-mockup-action-btn tes-mockup-action-btn--portfolio">
                            ↗
                          </div>
                        </a>
                      </div>

                    </div>
                  </div>
                </div>
              ) : (
                <pre className="tes-preview-text">{filledBody.replace(/<[^>]+>/g, "")}</pre>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Styles — dark glassmorphism premium theme
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
  z-index: 0;
  animation: tes-float 12s ease-in-out infinite alternate;
}
.tes-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #e05a2b 0%, transparent 70%);
  top: -100px; left: -100px;
  animation-duration: 14s;
}
.tes-orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  bottom: 50px; right: -80px;
  animation-duration: 18s;
  animation-delay: -5s;
}
.tes-orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  top: 40%; left: 45%;
  animation-duration: 22s;
  animation-delay: -10s;
  opacity: 0.08;
}
@keyframes tes-float {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(30px, 20px) scale(1.06); }
  100% { transform: translate(-20px, 35px) scale(0.95); }
}

/* ── Outer wrapper ───────────────────────────────────────────── */
.tes-wrap {
  position: relative;
  z-index: 1;
  max-width: 1320px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

/* ── Header ─────────────────────────────────────────────────── */
.tes-header {
  text-align: center;
  margin-bottom: 2.75rem;
}
.tes-header-top-row {
  margin-bottom: 1rem;
}
.tes-breadcrumb-link {
  font-size: 0.8rem;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;
}
.tes-breadcrumb-link:hover {
  color: #38bdf8;
}
.tes-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-2);
  background: rgba(224,90,43,0.1);
  border: 1px solid rgba(224,90,43,0.25);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}
.tes-header-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
  animation: tes-pulse 2s infinite;
}
@keyframes tes-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.75); }
}
.tes-title {
  font-family: var(--sans);
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: #fff;
  margin-bottom: 0.65rem;
}
.tes-title-accent {
  background: linear-gradient(135deg, var(--accent-2) 0%, #ffbe76 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.tes-sub {
  font-size: 0.95rem;
  color: var(--text-soft);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ── Main layout ─────────────────────────────────────────────── */
.tes-layout {
  display: grid;
  grid-template-columns: 240px 1fr 1.25fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 1080px) {
  .tes-layout { grid-template-columns: 1fr 1.15fr; }
  .tes-stack   { grid-column: 1 / -1; }
}
@media (max-width: 820px) {
  .tes-layout { grid-template-columns: 1fr; }
}

/* ── Template list / stack ───────────────────────────────────── */
.tes-stack {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.tes-stack-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-soft);
  padding: 0 0.25rem 0.25rem;
}
.tes-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  cursor: pointer;
  text-align: left;
  transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.tes-card:hover {
  background: var(--surface-2);
  border-color: var(--border-2);
  transform: translateY(-1px);
}
.tes-card--active {
  background: rgba(224,90,43,0.1);
  border-color: rgba(224,90,43,0.45);
  box-shadow: 0 0 20px rgba(224,90,43,0.15);
}
.tes-card-icon {
  font-size: 1.4rem;
  line-height: 1;
  flex-shrink: 0;
}
.tes-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
.tes-card-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tes-card-preview {
  font-size: 0.72rem;
  color: var(--text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tes-card-pip {
  position: absolute;
  right: 0.85rem;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
}

/* ── Pre-filled Company Banner ──────────────────────────────── */
.tes-company-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 18px;
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.35);
  border-radius: var(--radius-sm);
  margin-bottom: 20px;
  font-size: 13px;
  color: #e0f2fe;
  flex-wrap: wrap;
}
.tes-company-banner-text {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tes-company-icon { font-size: 16px; }
.tes-company-email {
  color: #38bdf8;
  font-family: monospace;
}
.tes-company-back-link {
  font-size: 12px;
  color: #38bdf8;
  text-decoration: none;
  transition: opacity 0.2s;
}
.tes-company-back-link:hover {
  text-decoration: underline;
  opacity: 0.85;
}

/* ── Composer panel ─────────────────────────────────────────── */
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

/* ── Form rows & inputs ──────────────────────────────────────── */
.tes-field-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.tes-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.tes-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.tes-reset-subject-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  color: var(--accent-2);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}
.tes-reset-subject-btn:hover {
  text-decoration: underline;
  opacity: 0.85;
}
.tes-subject-hint {
  font-size: 0.65rem;
  color: var(--text-soft);
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
}
.tes-required {
  color: var(--accent);
  margin-left: 2px;
}
.tes-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: #fff;
  font-family: var(--sans);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.tes-input:focus {
  background: rgba(255,255,255,0.08);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.tes-input::placeholder {
  color: rgba(255,255,255,0.22);
}
.tes-input--error {
  border-color: var(--red);
  box-shadow: 0 0 0 3px rgba(239,68,68,0.2);
}
.tes-textarea {
  resize: vertical;
  min-height: 90px;
  line-height: 1.55;
  font-size: 0.85rem;
}
.tes-error {
  font-size: 0.68rem;
  color: #f87171;
  font-weight: 500;
}
.tes-locked-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.85rem;
  background: rgba(255,255,255,0.025);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.tes-locked-tag {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-2);
  background: rgba(224,90,43,0.15);
  border: 1px solid rgba(224,90,43,0.3);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  flex-shrink: 0;
}
.tes-locked-copy {
  font-size: 0.72rem;
  color: var(--text-soft);
  line-height: 1.4;
}

/* ── Cover letter panel & options ───────────────────────────── */
.tes-cover-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  margin-top: 4px;
  margin-bottom: 6px;
}
.tes-cover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 6px;
}
.tes-cover-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fb923c;
  display: flex;
  align-items: center;
  gap: 6px;
}
.tes-cover-sub {
  font-size: 11px;
  color: var(--text-soft);
}
.tes-presets-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.tes-preset-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  color: var(--text-soft);
  cursor: pointer;
  transition: all 0.15s ease;
}
.tes-preset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  border-color: var(--border-2);
}
.tes-preset-btn--active {
  background: rgba(224, 90, 43, 0.2);
  border-color: rgba(224, 90, 43, 0.5);
  color: #ff9d7d;
  font-weight: 500;
}

/* ── Cover letter toggle card ───────────────────────────────── */
.tes-cover-toggle-card {
  background: rgba(255, 255, 255, 0.025);
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  margin-top: 4px;
}
.tes-checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text);
}
.tes-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
  cursor: pointer;
}
.tes-presets-mt {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.tes-fields {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

/* ── Send button ─────────────────────────────────────────────── */
.tes-send {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem 1.4rem;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  border: none;
  border-radius: var(--radius-sm);
  color: #fff;
  font-family: var(--sans);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px var(--accent-glow);
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  margin-top: 0.4rem;
}
.tes-send:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 28px rgba(224,90,43,0.5);
}
.tes-send:active:not(:disabled) { transform: translateY(0); }
.tes-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}
.tes-send--success {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  box-shadow: 0 4px 20px rgba(34,197,94,0.35);
}
.tes-send--error {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  box-shadow: 0 4px 20px rgba(239,68,68,0.35);
}
.tes-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: tes-spin 0.7s linear infinite;
}
@keyframes tes-spin { to { transform: rotate(360deg); } }
.tes-send-error-msg {
  font-size: 0.75rem;
  color: #f87171;
  text-align: center;
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
.tes-preview-mode-switch {
  margin-left: auto;
  display: flex;
  gap: 5px;
}
.tes-mode-btn {
  font-size: 11px;
  font-family: var(--sans);
  padding: 3px 8px;
  border-radius: 5px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-soft);
  cursor: pointer;
  transition: all 0.15s ease;
}
.tes-mode-btn:hover {
  color: #fff;
  border-color: var(--border-2);
}
.tes-mode-btn--active {
  background: rgba(224, 90, 43, 0.2);
  border-color: rgba(224, 90, 43, 0.5);
  color: #ff9d7d;
  font-weight: 500;
}
.tes-preview-body { padding: 1.2rem; }
.tes-preview-meta { display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 1rem; }
.tes-meta-row { display: flex; gap: 0.65rem; align-items: flex-start; }
.tes-meta-key {
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-soft);
  min-width: 4.8rem;
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
  color: rgba(232,232,240,0.85);
  word-break: break-word;
}

/* ── Visual Email Mockup Card ────────────────────────────────── */
.tes-mockup-wrapper {
  background: #f7f4ee;
  padding: 16px;
  border-radius: 16px;
  max-height: 700px;
  overflow-y: auto;
  border: 1px solid rgba(255,255,255,0.06);
}
.tes-mockup-card {
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 32px rgba(0,0,0,0.09);
  border: 1px solid #ebdcd0;
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.tes-mockup-header {
  background-color: #faefe7;
  background-image: url('/images/header-bg.jpg');
  background-size: cover;
  background-position: right center;
  background-repeat: no-repeat;
  min-height: 185px;
  padding: 26px 22px 22px;
  display: flex;
  align-items: center;
  position: relative;
}
.tes-mockup-header-content {
  width: 63%;
  max-width: 63%;
}
.tes-mockup-header-tag {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c24b27;
  margin-bottom: 6px;
}
.tes-mockup-header-title {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  line-height: 1.25;
  letter-spacing: -0.02em;
}
.tes-mockup-header-company {
  font-size: 13.5px;
  font-weight: 600;
  color: #4b5563;
}
.tes-mockup-header-company span {
  color: #c24b27;
  font-weight: 700;
}
.tes-mockup-body {
  padding: 22px 22px 24px;
  background: #ffffff;
}
.tes-mockup-paragraphs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tes-mockup-p {
  font-size: 13.5px;
  line-height: 1.65;
  color: #2d3748;
  margin: 0;
}
.tes-mockup-p b, .tes-mockup-p strong {
  color: #111827;
  font-weight: 700;
}
.tes-mockup-signature {
  background: #fbf5ef;
  border: 1px solid #f3e6d8;
  border-radius: 14px;
  padding: 14px 16px;
  margin: 22px 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.tes-mockup-sig-left {
  flex: 1;
}
.tes-mockup-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 9px;
}
.tes-mockup-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c24b27 0%, #de6537 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tes-mockup-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}
.tes-mockup-role {
  font-size: 11.5px;
  font-weight: 600;
  color: #c24b27;
  margin-top: 2px;
}
.tes-mockup-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tes-mockup-pill {
  background: #f1e3d6;
  color: #5d4b3e;
  font-size: 9.5px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}
.tes-mockup-sig-divider {
  width: 1px;
  background: #e8d9cc;
  align-self: stretch;
}
.tes-mockup-sig-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.tes-mockup-contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #374151;
  font-weight: 500;
}
.tes-mockup-contact-icon {
  font-size: 11.5px;
  flex-shrink: 0;
}
.tes-mockup-contact-icon--orange { color: #c24b27; }
.tes-mockup-contact-icon--blue { color: #2563eb; }
.tes-mockup-contact-icon--linkedin {
  background: #0077b5;
  color: #fff;
  font-size: 8.5px;
  font-weight: 800;
  padding: 1px 3px;
  border-radius: 2px;
  line-height: 1;
}
.tes-mockup-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}
.tes-mockup-action-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 11px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.tes-mockup-action-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.tes-mockup-action-card--resume {
  background: #fdf2ee;
  border: 1px solid #fae0d4;
}
.tes-mockup-action-card--portfolio {
  background: #f0f7ff;
  border: 1px solid #d9ebff;
}
.tes-mockup-action-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tes-mockup-action-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}
.tes-mockup-action-icon--resume {
  background: #f8ded4;
}
.tes-mockup-action-icon--portfolio {
  background: #0070f3;
  color: #fff;
  border-radius: 50%;
}
.tes-mockup-action-title {
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}
.tes-mockup-action-sub {
  font-size: 10px;
  color: #6b7280;
  margin-top: 1px;
}
.tes-mockup-action-btn {
  font-size: 13px;
  font-weight: 700;
}
.tes-mockup-action-btn--resume { color: #c24b27; }
.tes-mockup-action-btn--portfolio { color: #0070f3; }
`;

