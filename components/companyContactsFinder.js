import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Download,
  Send,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  History,
  Trash2,
  RefreshCw,
  Layers,
  ChevronRight,
  HelpCircle,
  Users,
  Briefcase,
  Info,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";

const PRESET_COMPANIES = [
  { name: "Infosys", location: "Pune", website: "infosys.com" },
  { name: "Tata Consultancy Services", location: "Mumbai", website: "tcs.com" },
  { name: "Wipro", location: "Bengaluru", website: "wipro.com" },
  { name: "Persistent Systems", location: "Pune", website: "persistent.com" },
  { name: "Microsoft", location: "Hyderabad", website: "microsoft.com" },
  { name: "Google", location: "Bengaluru", website: "google.com" },
];

const POPULAR_LOCATIONS = [
  "Pune",
  "Bengaluru",
  "Mumbai",
  "Hyderabad",
  "Delhi NCR",
  "Chennai",
  "London",
  "San Francisco",
];

const SCAN_STEPS = [
  "Discovering official corporate domain & DNS...",
  "Crawling homepage, /contact, and /careers pages...",
  "Extracting candidate email addresses and direct phone lines...",
  "Verifying domain MX mail-exchange records & ranking relevance...",
];

export default function CompanyContactsFinder() {
  // Input states
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [showWebsiteField, setShowWebsiteField] = useState(false);

  // Execution states
  const [loading, setLoading] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // UI interaction states
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'hr' | 'info' | 'other' | 'phones' | 'pages'
  const [searchFilter, setSearchFilter] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Auto-step interval when loading
  useEffect(() => {
    let interval;
    if (loading) {
      setScanStepIndex(0);
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("company_contact_history");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load history", e);
    }
  }, []);

  // Save search to history
  const saveToHistory = (companyName, loc, web) => {
    try {
      const newItem = {
        company: companyName,
        location: loc,
        website: web,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const filtered = recentSearches.filter(
        (item) => item.company.toLowerCase() !== companyName.toLowerCase()
      );
      const updated = [newItem, ...filtered].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem("company_contact_history", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save history", e);
    }
  };

  const clearHistory = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("company_contact_history");
    } catch (e) {}
  };

  // Submit handler
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const trimmedCompany = company.trim();
    if (!trimmedCompany) {
      setError("Please enter a company name to start searching.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setActiveTab("all");
    setSearchFilter("");

    try {
      const params = new URLSearchParams({ company: trimmedCompany });
      if (location.trim()) params.append("location", location.trim());
      if (website.trim()) params.append("website", website.trim());

      const res = await fetch(`/api/company-contacts?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `HTTP error ${res.status}`);
      }

      setData(json);
      saveToHistory(trimmedCompany, location.trim(), website.trim());
    } catch (err) {
      console.error("Search failed:", err);
      setError(err.message || "Failed to contact discovery service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setCompany(preset.name);
    setLocation(preset.location || "");
    setWebsite(preset.website || "");
    if (preset.website) setShowWebsiteField(true);
  };

  // Clipboard copy utility
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Batch actions
  const getHrEmails = () => (data?.hr || []).map((e) => e.email);
  const getAllEmails = () => [
    ...(data?.hr || []).map((e) => e.email),
    ...(data?.info || []).map((e) => e.email),
    ...(data?.other || []).map((e) => e.email),
  ];

  const handleCopyAllHr = () => {
    const list = getHrEmails();
    if (list.length === 0) return;
    handleCopy(list.join(", "), "batch-hr");
  };

  const handleCopyAllEmails = () => {
    const list = getAllEmails();
    if (list.length === 0) return;
    handleCopy(list.join(", "), "batch-all");
  };

  // Export as CSV
  const handleExportCSV = () => {
    if (!data) return;
    const rows = [["Type", "Contact", "Domain Match", "Location Match", "MX Valid", "Source Page"]];

    (data.hr || []).forEach((e) =>
      rows.push(["HR Email", e.email, e.sameDomain ? "Yes" : "No", e.locationMatch ? "Yes" : "No", e.domainCanReceiveMail ? "Valid" : "Invalid", e.source || ""])
    );
    (data.info || []).forEach((e) =>
      rows.push(["General Email", e.email, e.sameDomain ? "Yes" : "No", e.locationMatch ? "Yes" : "No", e.domainCanReceiveMail ? "Valid" : "Invalid", e.source || ""])
    );
    (data.other || []).forEach((e) =>
      rows.push(["Other Email", e.email, e.sameDomain ? "Yes" : "No", e.locationMatch ? "Yes" : "No", e.domainCanReceiveMail ? "Valid" : "Invalid", e.source || ""])
    );
    (data.phones || []).forEach((p) =>
      rows.push(["Phone", p.phone, "-", p.locationMatch ? "Yes" : "No", "-", p.source || ""])
    );

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${(data.company || "company").toLowerCase().replace(/\s+/g, "_")}_contacts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as JSON
  const handleExportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.company || "company").toLowerCase().replace(/\s+/g, "_")}_contacts.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtered contacts based on search query
  const query = searchFilter.trim().toLowerCase();
  const filterList = (list) => {
    if (!query) return list || [];
    return (list || []).filter(
      (item) =>
        (item.email && item.email.toLowerCase().includes(query)) ||
        (item.phone && item.phone.toLowerCase().includes(query)) ||
        (item.source && item.source.toLowerCase().includes(query))
    );
  };

  const hrFiltered = filterList(data?.hr);
  const infoFiltered = filterList(data?.info);
  const otherFiltered = filterList(data?.other);
  const phonesFiltered = filterList(data?.phones);
  const totalEmailsCount = (data?.hr?.length || 0) + (data?.info?.length || 0) + (data?.other?.length || 0);

  return (
    <>
      <Head>
        <title>Company Contacts & Recruiter Intelligence Finder | Tools</title>
        <meta
          name="description"
          content="Find verified HR recruiters, career contacts, support emails, and direct phone numbers for any company with live DNS MX verification."
        />
      </Head>

      <div className="finder-root">
        {/* Ambient background glows */}
        <div className="glow-sphere sphere-1" />
        <div className="glow-sphere sphere-2" />

        <div className="finder-container">
          {/* Top navigation breadcrumb */}
          <div className="breadcrumb">
            <Link href="/quick_tools" className="breadcrumb-link">
              <span>Quick Tools</span>
            </Link>
            <ChevronRight size={14} className="breadcrumb-chevron" />
            <span className="breadcrumb-active">Company Contact Finder</span>
          </div>

          {/* Header Hero */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-section"
          >
            <div className="hero-badge">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Real-Time Corporate Discovery & MX Verification</span>
            </div>
            <h1 className="hero-title">
              Find Verified <span className="gradient-text">HR & Company Contacts</span>
            </h1>
            <p className="hero-subtitle">
              Instantly crawl official websites, extract recruiter emails, discover phone lines, and verify DNS deliverability — without expensive paid APIs.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="search-card"
          >
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-grid">
                {/* Company Name */}
                <div className="input-group company-input-group">
                  <label htmlFor="company-name" className="input-label">
                    <span>Company Name</span>
                    <span className="required-tag">*Required</span>
                  </label>
                  <div className="input-box-wrapper">
                    <Building2 size={18} className="input-icon" />
                    <input
                      id="company-name"
                      type="text"
                      placeholder="e.g. Infosys, TCS, Stripe, Google"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={loading}
                      className="text-input"
                      required
                    />
                    {company && !loading && (
                      <button
                        type="button"
                        onClick={() => setCompany("")}
                        className="input-clear-btn"
                        title="Clear company"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="input-group">
                  <label htmlFor="company-location" className="input-label">
                    <span>Target City / Location</span>
                    <span className="optional-tag">Optional</span>
                  </label>
                  <div className="input-box-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      id="company-location"
                      type="text"
                      placeholder="e.g. Pune, Bengaluru, Mumbai"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={loading}
                      className="text-input"
                    />
                    {location && !loading && (
                      <button
                        type="button"
                        onClick={() => setLocation("")}
                        className="input-clear-btn"
                        title="Clear location"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Website Toggle & Optional Input */}
              <div className="website-section">
                {!showWebsiteField ? (
                  <button
                    type="button"
                    onClick={() => setShowWebsiteField(true)}
                    className="toggle-website-btn"
                  >
                    <Globe size={14} />
                    <span>+ Add Official Website URL (Faster & more accurate)</span>
                  </button>
                ) : (
                  <div className="input-group website-input-group">
                    <div className="input-label">
                      <span>Official Website / Domain</span>
                      <button
                        type="button"
                        onClick={() => {
                          setWebsite("");
                          setShowWebsiteField(false);
                        }}
                        className="hide-website-btn"
                      >
                        Hide
                      </button>
                    </div>
                    <div className="input-box-wrapper">
                      <Globe size={18} className="input-icon" />
                      <input
                        type="text"
                        placeholder="e.g. infosys.com or https://company.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        disabled={loading}
                        className="text-input"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Preset Companies */}
              <div className="presets-container">
                <span className="presets-label">Quick Examples:</span>
                <div className="presets-list">
                  {PRESET_COMPANIES.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(item)}
                      disabled={loading}
                      className="preset-chip"
                    >
                      <span>{item.name}</span>
                      <span className="preset-city">{item.location}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Location Chips */}
              <div className="location-chips-container">
                <span className="presets-label">Popular Hubs:</span>
                <div className="presets-list">
                  {POPULAR_LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLocation(loc)}
                      disabled={loading}
                      className={`location-chip ${location === loc ? "active" : ""}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="form-action-row">
                <button
                  type="submit"
                  disabled={loading || !company.trim()}
                  className="submit-search-btn"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Scanning Company Web Pages...</span>
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      <span>Find Contacts & HR</span>
                    </>
                  )}
                </button>

                {(company || location || website || data) && !loading && (
                  <button
                    type="button"
                    onClick={() => {
                      setCompany("");
                      setLocation("");
                      setWebsite("");
                      setData(null);
                      setError(null);
                    }}
                    className="reset-form-btn"
                  >
                    Reset Form
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !loading && (
            <div className="history-bar">
              <div className="history-header">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <History size={13} />
                  <span>Recent Scans:</span>
                </div>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="clear-history-btn"
                  title="Clear history"
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>
              </div>
              <div className="history-items">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCompany(item.company);
                      setLocation(item.location || "");
                      setWebsite(item.website || "");
                      if (item.website) setShowWebsiteField(true);
                    }}
                    className="history-pill"
                  >
                    <span className="font-medium text-neutral-200">{item.company}</span>
                    {item.location && <span className="history-loc">({item.location})</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Scanning Visualizer */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="loading-card"
              >
                <div className="radar-circle">
                  <div className="radar-ping" />
                  <Building2 size={28} className="text-cyan-400 z-10" />
                </div>
                <h3 className="loading-title">Crawling Company Intelligence</h3>
                <p className="loading-desc">
                  Scanning for official contact portals, careers pages, emails, and checking DNS MX records...
                </p>

                <div className="progress-steps-list">
                  {SCAN_STEPS.map((step, idx) => {
                    const isDone = idx < scanStepIndex;
                    const isCurrent = idx === scanStepIndex;
                    return (
                      <div
                        key={idx}
                        className={`step-item ${isDone ? "step-done" : isCurrent ? "step-active" : "step-pending"}`}
                      >
                        <div className="step-indicator">
                          {isDone ? (
                            <Check size={12} className="text-white" />
                          ) : isCurrent ? (
                            <RefreshCw size={12} className="animate-spin text-cyan-400" />
                          ) : (
                            <span className="step-number">{idx + 1}</span>
                          )}
                        </div>
                        <span className="step-text">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-alert"
            >
              <AlertCircle size={20} className="text-rose-400 shrink-0" />
              <div className="error-content">
                <h4 className="error-heading">Search Encountered an Issue</h4>
                <p className="error-text">{error}</p>
                <p className="error-hint">
                  Tip: Provide the direct website domain (e.g., <code>domain.com</code>) to bypass search engine discovery.
                </p>
              </div>
            </motion.div>
          )}

          {/* Results Display */}
          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="results-container"
            >
              {/* Company Summary Header */}
              <div className="company-summary-card">
                <div className="company-info-col">
                  <div className="company-badge-row">
                    <span className="company-tag">Verified Scan</span>
                    {data.primary && data.primary !== "none" && (
                      <span className={`primary-channel-pill ${data.primary}`}>
                        <Sparkles size={12} />
                        <span>Best Channel: {data.primary.toUpperCase()}</span>
                      </span>
                    )}
                  </div>
                  <h2 className="company-name-heading">{data.company}</h2>

                  {data.website ? (
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="company-website-link"
                    >
                      <Globe size={15} />
                      <span>{data.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span className="no-website-tag">
                      <AlertCircle size={14} />
                      Website could not be resolved automatically
                    </span>
                  )}
                </div>

                {/* Batch Actions */}
                <div className="batch-actions-col">
                  {(data.hr?.[0]?.email || data.info?.[0]?.email || data.other?.[0]?.email) && (
                    <Link
                      href={`/send-email?to=${encodeURIComponent(data.hr?.[0]?.email || data.info?.[0]?.email || data.other?.[0]?.email)}&company=${encodeURIComponent(data.company || "")}&website=${encodeURIComponent(data.website || "")}`}
                      className="batch-btn send-mail-btn"
                      title="Send email and cover letter to this company"
                    >
                      <Send size={14} className="text-cyan-300" />
                      <span>Send Mail / Cover Letter</span>
                    </Link>
                  )}

                  {data.hr?.length > 0 && (
                    <button
                      type="button"
                      onClick={handleCopyAllHr}
                      className="batch-btn hr-btn"
                    >
                      {copiedKey === "batch-hr" ? (
                        <>
                          <Check size={14} className="text-emerald-300" />
                          <span>Copied {data.hr.length} HR Emails!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy All HR Emails ({data.hr.length})</span>
                        </>
                      )}
                    </button>
                  )}

                  {totalEmailsCount > 0 && (
                    <button
                      type="button"
                      onClick={handleCopyAllEmails}
                      className="batch-btn neutral-btn"
                    >
                      {copiedKey === "batch-all" ? (
                        <>
                          <Check size={14} className="text-emerald-300" />
                          <span>Copied All {totalEmailsCount} Emails!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy All Emails ({totalEmailsCount})</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="export-btn"
                      title="Export as CSV spreadsheet"
                    >
                      <Download size={14} />
                      <span>CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="export-btn"
                      title="Export raw JSON"
                    >
                      <Download size={14} />
                      <span>JSON</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrap hr-icon">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div className="stat-number">{data.hr?.length || 0}</div>
                    <div className="stat-label">HR & Careers</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap info-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="stat-number">{data.info?.length || 0}</div>
                    <div className="stat-label">General & Inquiries</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap phone-icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="stat-number">{data.phones?.length || 0}</div>
                    <div className="stat-label">Phone Numbers</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap crawl-icon">
                    <Layers size={20} />
                  </div>
                  <div>
                    <div className="stat-number">{data.pagesChecked?.length || 0}</div>
                    <div className="stat-label">Pages Checked</div>
                  </div>
                </div>
              </div>

              {/* Notes Banner if applicable */}
              {data.notes && (
                <div className="notes-banner">
                  <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div className="notes-text">
                    <p className="font-semibold text-amber-200">Scan Diagnostic Note</p>
                    <p>{data.notes}</p>
                  </div>
                </div>
              )}

              {/* Tab Navigation & Live Search Filter */}
              <div className="controls-bar">
                <div className="tabs-nav">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                  >
                    <span>All Contacts</span>
                    <span className="tab-count">{totalEmailsCount + (data.phones?.length || 0)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("hr")}
                    className={`tab-btn ${activeTab === "hr" ? "active" : ""}`}
                  >
                    <span>💼 HR & Careers</span>
                    <span className="tab-count hr-count">{data.hr?.length || 0}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("info")}
                    className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
                  >
                    <span>📩 General</span>
                    <span className="tab-count">{data.info?.length || 0}</span>
                  </button>

                  {data.other?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("other")}
                      className={`tab-btn ${activeTab === "other" ? "active" : ""}`}
                    >
                      <span>Other</span>
                      <span className="tab-count">{data.other?.length || 0}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTab("phones")}
                    className={`tab-btn ${activeTab === "phones" ? "active" : ""}`}
                  >
                    <span>📞 Phones</span>
                    <span className="tab-count">{data.phones?.length || 0}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("pages")}
                    className={`tab-btn ${activeTab === "pages" ? "active" : ""}`}
                  >
                    <span>Audit Log</span>
                    <span className="tab-count">{data.pagesChecked?.length || 0}</span>
                  </button>
                </div>

                {/* Filter within results */}
                <div className="search-filter-box">
                  <Filter size={14} className="text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Filter results..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="filter-input"
                  />
                  {searchFilter && (
                    <button
                      type="button"
                      onClick={() => setSearchFilter("")}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Contacts Display Body */}
              <div className="tab-content-area">
                {/* 1. ALL OR HR TAB */}
                {(activeTab === "all" || activeTab === "hr") && hrFiltered.length > 0 && (
                  <div className="contact-category-section">
                    <div className="category-header">
                      <div className="flex items-center gap-2">
                        <span className="category-pill hr-pill">HR & Recruiting Desks</span>
                        <span className="category-sub">Direct emails for jobs, applications, and talent teams</span>
                      </div>
                    </div>

                    <div className="contacts-grid">
                      {hrFiltered.map((item, idx) => (
                        <ContactCard
                          key={`hr-${idx}`}
                          item={item}
                          category="hr"
                          companyName={data?.company}
                          companyWebsite={data?.website}
                          onCopy={handleCopy}
                          isCopied={copiedKey === `hr-${idx}`}
                          itemKey={`hr-${idx}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. ALL OR INFO TAB */}
                {(activeTab === "all" || activeTab === "info") && infoFiltered.length > 0 && (
                  <div className="contact-category-section">
                    <div className="category-header">
                      <div className="flex items-center gap-2">
                        <span className="category-pill info-pill">General & Office Desks</span>
                        <span className="category-sub">General corporate inquiries, hello, and support</span>
                      </div>
                    </div>

                    <div className="contacts-grid">
                      {infoFiltered.map((item, idx) => (
                        <ContactCard
                          key={`info-${idx}`}
                          item={item}
                          category="info"
                          companyName={data?.company}
                          companyWebsite={data?.website}
                          onCopy={handleCopy}
                          isCopied={copiedKey === `info-${idx}`}
                          itemKey={`info-${idx}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. ALL OR OTHER TAB */}
                {(activeTab === "all" || activeTab === "other") && otherFiltered.length > 0 && (
                  <div className="contact-category-section">
                    <div className="category-header">
                      <div className="flex items-center gap-2">
                        <span className="category-pill other-pill">Other Corporate Addresses</span>
                        <span className="category-sub">Found on official domain pages</span>
                      </div>
                    </div>

                    <div className="contacts-grid">
                      {otherFiltered.map((item, idx) => (
                        <ContactCard
                          key={`other-${idx}`}
                          item={item}
                          category="other"
                          companyName={data?.company}
                          companyWebsite={data?.website}
                          onCopy={handleCopy}
                          isCopied={copiedKey === `other-${idx}`}
                          itemKey={`other-${idx}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. ALL OR PHONES TAB */}
                {(activeTab === "all" || activeTab === "phones") && phonesFiltered.length > 0 && (
                  <div className="contact-category-section">
                    <div className="category-header">
                      <div className="flex items-center gap-2">
                        <span className="category-pill phone-pill">Phone Numbers</span>
                        <span className="category-sub">Direct office lines & recruitment contacts</span>
                      </div>
                    </div>

                    <div className="contacts-grid">
                      {phonesFiltered.map((phoneItem, idx) => (
                        <PhoneCard
                          key={`phone-${idx}`}
                          phoneItem={phoneItem}
                          onCopy={handleCopy}
                          isCopied={copiedKey === `phone-${idx}`}
                          itemKey={`phone-${idx}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. AUDIT LOG TAB */}
                {activeTab === "pages" && (
                  <div className="audit-section">
                    <div className="audit-header">
                      <h3 className="text-base font-semibold text-neutral-200">
                        Pages Traversed ({data.pagesChecked?.length || 0})
                      </h3>
                      <p className="text-xs text-neutral-400">
                        The scraper fetched and inspected the following internal URLs for contact information:
                      </p>
                    </div>

                    <div className="audit-links-list">
                      {data.pagesChecked?.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="audit-link-item"
                        >
                          <span className="audit-index">{idx + 1}</span>
                          <span className="audit-url">{url}</span>
                          <ExternalLink size={13} className="shrink-0 text-neutral-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State when tab or search filter yields nothing */}
                {((activeTab === "hr" && hrFiltered.length === 0) ||
                  (activeTab === "info" && infoFiltered.length === 0) ||
                  (activeTab === "other" && otherFiltered.length === 0) ||
                  (activeTab === "phones" && phonesFiltered.length === 0) ||
                  (activeTab === "all" &&
                    hrFiltered.length === 0 &&
                    infoFiltered.length === 0 &&
                    otherFiltered.length === 0 &&
                    phonesFiltered.length === 0)) && (
                  <div className="empty-tab-state">
                    <HelpCircle size={36} className="text-neutral-500 mb-2" />
                    <p className="text-neutral-300 font-medium">No contacts match the current view.</p>
                    <p className="text-xs text-neutral-500 mt-1 max-w-md text-center">
                      {searchFilter
                        ? `No items found matching "${searchFilter}". Try clearing the filter.`
                        : "No contacts detected in this category. Some corporate websites render contacts via client-side JavaScript or require form submission."}
                    </p>
                    {searchFilter && (
                      <button
                        type="button"
                        onClick={() => setSearchFilter("")}
                        className="mt-3 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-700"
                      >
                        Clear search filter
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <style jsx>{`
        .finder-root {
          position: relative;
          min-height: 100vh;
          background: #090a0f;
          color: #f3f4f6;
          padding: 80px 20px 100px;
          overflow-x: hidden;
          font-family: var(--default-font-family, system-ui, sans-serif);
        }

        .glow-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.15;
        }

        .sphere-1 {
          width: 500px;
          height: 500px;
          top: 50px;
          left: -150px;
          background: radial-gradient(circle, #8605ff, #3b82f6);
        }

        .sphere-2 {
          width: 450px;
          height: 450px;
          top: 250px;
          right: -100px;
          background: radial-gradient(circle, #06b6d4, #10b981);
        }

        .finder-container {
          position: relative;
          z-index: 1;
          max-width: 1080px;
          margin: 0 auto;
        }

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #9ca3af;
          margin-bottom: 24px;
        }

        .breadcrumb-link {
          color: #9ca3af;
          transition: color 0.2s;
        }

        .breadcrumb-link:hover {
          color: #38bdf8;
        }

        .breadcrumb-chevron {
          color: #4b5563;
        }

        .breadcrumb-active {
          color: #e5e7eb;
          font-weight: 500;
        }

        /* Hero */
        .hero-section {
          text-align: center;
          margin-bottom: 36px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          color: #38bdf8;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-bottom: 16px;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.85rem;
          }
        }

        .gradient-text {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          max-width: 680px;
          margin: 0 auto;
          font-size: 15px;
          line-height: 1.6;
          color: #9ca3af;
        }

        /* Search Card */
        .search-card {
          background: rgba(18, 20, 29, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
          margin-bottom: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 18px;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 500;
          color: #d1d5db;
        }

        .required-tag {
          font-size: 11px;
          color: #f43f5e;
          font-weight: 400;
        }

        .optional-tag {
          font-size: 11px;
          color: #6b7280;
          font-weight: 400;
        }

        .input-box-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(11, 12, 18, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .input-box-wrapper:focus-within {
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #6b7280;
          pointer-events: none;
        }

        .text-input {
          width: 100%;
          background: transparent;
          border: none;
          color: #f3f4f6;
          padding: 12px 38px 12px 42px;
          font-size: 14px;
          outline: none;
        }

        .text-input::placeholder {
          color: #4b5563;
        }

        .input-clear-btn {
          position: absolute;
          right: 12px;
          color: #9ca3af;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .input-clear-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        /* Website Toggle */
        .website-section {
          margin-bottom: 18px;
        }

        .toggle-website-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #38bdf8;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .toggle-website-btn:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .hide-website-btn {
          font-size: 11px;
          color: #9ca3af;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .hide-website-btn:hover {
          color: #fff;
        }

        /* Presets & Chips */
        .presets-container,
        .location-chips-container {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .presets-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          white-space: nowrap;
        }

        .presets-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .preset-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 5px 10px;
          font-size: 12px;
          color: #d1d5db;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-chip:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .preset-city {
          font-size: 10px;
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .location-chip {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          color: #9ca3af;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .location-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .location-chip.active {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
          color: #38bdf8;
        }

        /* Actions */
        .form-action-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
        }

        .submit-search-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
          color: #ffffff;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 25px -6px rgba(14, 165, 233, 0.5);
          transition: all 0.2s ease;
        }

        .submit-search-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px -6px rgba(14, 165, 233, 0.65);
          filter: brightness(1.08);
        }

        .submit-search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        .reset-form-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #9ca3af;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reset-form-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        /* History bar */
        .history-bar {
          background: rgba(18, 20, 29, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 12px 18px;
          margin-bottom: 24px;
        }

        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .clear-history-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .clear-history-btn:hover {
          color: #ef4444;
        }

        .history-items {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .history-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 12px;
          color: #d1d5db;
          cursor: pointer;
          transition: background 0.15s;
        }

        .history-pill:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .history-loc {
          font-size: 11px;
          color: #9ca3af;
        }

        /* Loading Card */
        .loading-card {
          background: rgba(18, 20, 29, 0.95);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 20px;
          padding: 36px 28px;
          text-align: center;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .radar-circle {
          position: relative;
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radar-ping {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(56, 189, 248, 0.6);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%,
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        .loading-title {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 6px;
        }

        .loading-desc {
          font-size: 13px;
          color: #9ca3af;
          max-width: 500px;
          margin: 0 auto 24px;
        }

        .progress-steps-list {
          max-width: 440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          transition: all 0.25s ease;
        }

        .step-indicator {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
        }

        .step-done {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
        }

        .step-done .step-indicator {
          background: #10b981;
        }

        .step-active {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          font-weight: 500;
        }

        .step-active .step-indicator {
          background: rgba(56, 189, 248, 0.2);
        }

        .step-pending {
          color: #4b5563;
        }

        .step-pending .step-indicator {
          background: rgba(255, 255, 255, 0.05);
          color: #6b7280;
        }

        /* Error */
        .error-alert {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: rgba(244, 63, 94, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .error-heading {
          font-size: 15px;
          font-weight: 600;
          color: #fda4af;
          margin-bottom: 4px;
        }

        .error-text {
          font-size: 13px;
          color: #e5e7eb;
          margin-bottom: 8px;
        }

        .error-hint {
          font-size: 12px;
          color: #9ca3af;
        }

        .error-hint code {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          color: #38bdf8;
        }

        /* Results */
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .company-summary-card {
          background: rgba(18, 20, 29, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          padding: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .company-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .company-tag {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          background: rgba(255, 255, 255, 0.06);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .primary-channel-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          padding: 3px 9px;
          border-radius: 6px;
        }

        .primary-channel-pill.hr {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
        }

        .primary-channel-pill.info {
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.35);
          color: #38bdf8;
        }

        .primary-channel-pill.other {
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fbbf24;
        }

        .company-name-heading {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .company-website-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #38bdf8;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .company-website-link:hover {
          text-decoration: underline;
          opacity: 0.85;
        }

        .no-website-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #f59e0b;
        }

        .batch-actions-col {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .batch-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .batch-btn.send-mail-btn {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.22), rgba(99, 102, 241, 0.22));
          border-color: rgba(6, 182, 212, 0.45);
          color: #38bdf8;
          text-decoration: none;
        }

        .batch-btn.send-mail-btn:hover {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.35), rgba(99, 102, 241, 0.35));
          border-color: rgba(56, 189, 248, 0.7);
          color: #ffffff;
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.3);
          transform: translateY(-1px);
        }

        .batch-btn.hr-btn {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.3);
          color: #34d399;
        }

        .batch-btn.hr-btn:hover {
          background: rgba(16, 185, 129, 0.25);
          transform: translateY(-1px);
        }

        .batch-btn.neutral-btn {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
        }

        .batch-btn.neutral-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .export-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #9ca3af;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-btn:hover {
          background: rgba(255, 255, 255, 0.09);
          color: #ffffff;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 840px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stat-card {
          background: rgba(18, 20, 29, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon-wrap.hr-icon {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
        }

        .stat-icon-wrap.info-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
        }

        .stat-icon-wrap.phone-icon {
          background: rgba(192, 132, 252, 0.12);
          color: #c084fc;
        }

        .stat-icon-wrap.crawl-icon {
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.1;
        }

        .stat-label {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
        }

        /* Notes banner */
        .notes-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 14px;
          padding: 16px 20px;
        }

        .notes-text {
          font-size: 13px;
          color: #fde68a;
          line-height: 1.5;
        }

        /* Controls bar */
        .controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .tabs-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: #9ca3af;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }

        .tab-btn.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }

        .tab-count {
          background: rgba(255, 255, 255, 0.08);
          color: #d1d5db;
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 9999px;
        }

        .tab-count.hr-count {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .search-filter-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(11, 12, 18, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 6px 12px;
          min-width: 220px;
        }

        .filter-input {
          background: transparent;
          border: none;
          outline: none;
          color: #e5e7eb;
          font-size: 13px;
          width: 100%;
        }

        .filter-input::placeholder {
          color: #4b5563;
        }

        /* Tab Content */
        .tab-content-area {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .contact-category-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .category-pill {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .category-pill.hr-pill {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .category-pill.info-pill {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .category-pill.other-pill {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .category-pill.phone-pill {
          background: rgba(192, 132, 252, 0.15);
          color: #c084fc;
          border: 1px solid rgba(192, 132, 252, 0.3);
        }

        .category-sub {
          font-size: 12px;
          color: #6b7280;
        }

        .contacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }

        /* Audit Log */
        .audit-section {
          background: rgba(18, 20, 29, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 24px;
        }

        .audit-header {
          margin-bottom: 16px;
        }

        .audit-links-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .audit-link-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: rgba(11, 12, 18, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .audit-link-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .audit-index {
          font-size: 11px;
          color: #6b7280;
          font-family: monospace;
          min-width: 18px;
        }

        .audit-url {
          font-size: 13px;
          color: #38bdf8;
          word-break: break-all;
          flex: 1;
        }

        .empty-tab-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: rgba(18, 20, 29, 0.4);
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }
      `}</style>
    </>
  );
}

// ── Contact Card Sub-Component ─────────────────────────────────────────────
function ContactCard({ item, category, companyName, companyWebsite, onCopy, isCopied, itemKey }) {
  const isHr = category === "hr";
  const sendEmailUrl = `/send-email?to=${encodeURIComponent(item.email)}&company=${encodeURIComponent(companyName || "")}&website=${encodeURIComponent(companyWebsite || "")}&role=${encodeURIComponent("Full Stack Developer")}`;

  return (
    <div className={`contact-card ${isHr ? "is-hr" : ""}`}>
      {/* Top row: Email and Copy/Mail actions */}
      <div className="card-top">
        <div className="email-display-wrap">
          <Mail size={16} className={`shrink-0 ${isHr ? "text-emerald-400" : "text-sky-400"}`} />
          <span className="email-text" title={item.email}>
            {item.email}
          </span>
        </div>

        <div className="card-action-btns">
          <Link
            href={sendEmailUrl}
            className="send-mail-portal-btn"
            title="Compose and send email / cover letter to this contact"
          >
            <Send size={12} />
            <span>Send Mail</span>
          </Link>

          <button
            type="button"
            onClick={() => onCopy(item.email, itemKey)}
            className="action-icon-btn copy-btn"
            title="Copy email to clipboard"
          >
            {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          <a
            href={`mailto:${item.email}?subject=Application / Opportunity — ${companyName || ""}`}
            className="action-icon-btn mail-btn"
            title="Open in external mail client"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Badges / Pill Tags */}
      <div className="card-tags">
        {/* MX Mailbox verification status */}
        {item.domainCanReceiveMail !== undefined && (
          <span
            className={`meta-badge ${
              item.domainCanReceiveMail ? "mx-valid" : "mx-unverified"
            }`}
            title={
              item.domainCanReceiveMail
                ? "Active MX DNS records detected. Domain is configured to receive emails."
                : "No active MX records found for this domain."
            }
          >
            {item.domainCanReceiveMail ? (
              <>
                <ShieldCheck size={12} />
                <span>MX Active</span>
              </>
            ) : (
              <>
                <ShieldAlert size={12} />
                <span>MX Check Failed</span>
              </>
            )}
          </span>
        )}

        {/* Location Match Badge */}
        {item.locationMatch && (
          <span className="meta-badge location-badge">
            <MapPin size={11} />
            <span>Target Location Match</span>
          </span>
        )}

        {/* Domain Match Badge */}
        {item.sameDomain ? (
          <span className="meta-badge domain-badge">Official Domain</span>
        ) : (
          <span className="meta-badge third-party-badge">External ATS / Domain</span>
        )}
      </div>

      {/* Discovered Source URL */}
      {item.source && (
        <div className="card-source-row">
          <span className="source-label">Source:</span>
          <a
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
            title={item.source}
          >
            <span>{item.source.replace(/^https?:\/\//, "")}</span>
            <ExternalLink size={11} />
          </a>
        </div>
      )}

      <style jsx>{`
        .contact-card {
          background: rgba(18, 20, 29, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .contact-card:hover {
          border-color: rgba(255, 255, 255, 0.18);
          background: rgba(22, 25, 36, 0.85);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.4);
        }

        .contact-card.is-hr {
          border-color: rgba(16, 185, 129, 0.25);
          background: rgba(16, 185, 129, 0.03);
        }

        .contact-card.is-hr:hover {
          border-color: rgba(16, 185, 129, 0.45);
          background: rgba(16, 185, 129, 0.06);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .email-display-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .email-text {
          font-family: monospace;
          font-size: 14px;
          font-weight: 600;
          color: #f3f4f6;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .card-action-btns {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .send-mail-portal-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 30px;
          padding: 0 10px;
          border-radius: 8px;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: #38bdf8;
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .send-mail-portal-btn:hover {
          background: rgba(6, 182, 212, 0.25);
          border-color: rgba(6, 182, 212, 0.65);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
          transform: translateY(-1px);
        }

        .action-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }

        .action-icon-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .card-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          padding: 2px 7px;
          border-radius: 5px;
          font-weight: 500;
        }

        .meta-badge.mx-valid {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .meta-badge.mx-unverified {
          background: rgba(244, 63, 94, 0.15);
          color: #fda4af;
          border: 1px solid rgba(244, 63, 94, 0.25);
        }

        .meta-badge.location-badge {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .meta-badge.domain-badge {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .meta-badge.third-party-badge {
          background: rgba(255, 255, 255, 0.04);
          color: #9ca3af;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .card-source-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #6b7280;
          overflow: hidden;
        }

        .source-label {
          flex-shrink: 0;
        }

        .source-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #9ca3af;
          text-decoration: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .source-link:hover {
          color: #38bdf8;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

// ── Phone Card Sub-Component ───────────────────────────────────────────────
function PhoneCard({ phoneItem, onCopy, isCopied, itemKey }) {
  const isHr = phoneItem.type === "hr";
  const isCallUs = phoneItem.type === "call_us" || /call\s*us/i.test(phoneItem.label || "");

  return (
    <div className="phone-card">
      <div className="phone-top">
        <div className="phone-display">
          <Phone size={16} className={isHr ? "text-purple-400" : isCallUs ? "text-emerald-400" : "text-sky-400"} />
          <span className="phone-text">{phoneItem.phone}</span>
        </div>

        <div className="phone-actions">
          <button
            type="button"
            onClick={() => onCopy(phoneItem.phone, itemKey)}
            className="action-icon-btn"
            title="Copy number"
          >
            {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          <a href={`tel:${phoneItem.phone}`} className="action-icon-btn" title="Call number">
            <Phone size={13} />
          </a>
        </div>
      </div>

      <div className="phone-tags">
        <span className={`type-tag ${isHr ? "hr-type" : isCallUs ? "call-type" : "general-type"}`}>
          {phoneItem.label || (isHr ? "HR / Talent Direct" : isCallUs ? "Call Us" : "General Office")}
        </span>

        {phoneItem.locationMatch && (
          <span className="loc-match-tag">
            <MapPin size={11} />
            <span>Target Location</span>
          </span>
        )}
      </div>

      {phoneItem.source && (
        <div className="phone-source">
          <span>Source:</span>
          <a
            href={phoneItem.source}
            target="_blank"
            rel="noopener noreferrer"
            className="phone-source-link"
          >
            <span>{phoneItem.source.replace(/^https?:\/\//, "")}</span>
            <ExternalLink size={11} />
          </a>
        </div>
      )}

      <style jsx>{`
        .phone-card {
          background: rgba(18, 20, 29, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .phone-card:hover {
          border-color: rgba(255, 255, 255, 0.18);
          background: rgba(22, 25, 36, 0.85);
          transform: translateY(-2px);
        }

        .phone-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .phone-display {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .phone-text {
          font-family: monospace;
          font-size: 15px;
          font-weight: 600;
          color: #f3f4f6;
        }

        .phone-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }

        .action-icon-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .phone-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .type-tag {
          font-size: 11px;
          padding: 2px 7px;
          border-radius: 5px;
          font-weight: 500;
        }

        .type-tag.hr-type {
          background: rgba(192, 132, 252, 0.15);
          color: #c084fc;
          border: 1px solid rgba(192, 132, 252, 0.3);
        }

        .type-tag.call-type {
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }

        .type-tag.general-type {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .loc-match-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 2px 6px;
          border-radius: 5px;
        }

        .phone-source {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #6b7280;
          overflow: hidden;
        }

        .phone-source-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #9ca3af;
          text-decoration: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .phone-source-link:hover {
          color: #38bdf8;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
