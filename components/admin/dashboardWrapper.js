import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

/* ─── tiny helpers ─────────────────────────────────────────────────────── */
const fmtNum = (n) => (n ?? 0).toLocaleString();

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: "#0f172a",
      border: `1px solid ${color}22`,
      borderRadius: "16px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "80px", height: "80px",
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
      }} />
      <div style={{ fontSize: "26px" }}>{icon}</div>
      <div style={{ fontSize: "32px", fontWeight: "800", color: "#f1f5f9", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{label}</div>
      {sub && <div style={{ fontSize: "12px", color: color, fontWeight: "600" }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, color }) {
  if (!data?.length) return <div style={{ color: "#475569", textAlign: "center", padding: "20px" }}>No data yet</div>;
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {data.map((item) => (
        <div key={item.page_path} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "130px", fontSize: "11px", color: "#94a3b8",
            textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flexShrink: 0,
            textAlign: "right",
          }} title={item.page_path}>
            {item.page_path || "/"}
          </div>
          <div style={{ flex: 1, background: "#1e293b", borderRadius: "6px", height: "22px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(item.count / max) * 100}%`,
              background: `linear-gradient(90deg, ${color}, ${color}88)`,
              borderRadius: "6px",
              transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
              minWidth: "4px",
            }} />
          </div>
          <div style={{ fontSize: "12px", color: "#f1f5f9", fontWeight: "700", width: "36px", flexShrink: 0 }}>
            {fmtNum(item.count)}
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutSlice({ value, total, color, label, idx, count }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 14px",
      background: "#0f172a",
      borderRadius: "10px",
      border: "1px solid #1e293b",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, flexShrink: 0 }} />
        <span style={{ fontSize: "13px", color: "#cbd5e1" }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "80px", height: "6px", background: "#1e293b", borderRadius: "3px", overflow: "hidden",
        }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "3px" }} />
        </div>
        <span style={{ fontSize: "12px", color: "#94a3b8", width: "36px", textAlign: "right" }}>{fmtNum(count)}</span>
        <span style={{ fontSize: "11px", color: color, width: "36px", textAlign: "right" }}>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────────────── */
export default function DashboardWrapper() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const redirectingRef = useRef(false);

  // analytics state
  const [range, setRange] = useState(7); // days
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  /* ── auth ── */
  useEffect(() => {
    let mounted = true;
    let redirectTimeoutId = null;

    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      if (!currentSession) {
        redirectTimeoutId = setTimeout(async () => {
          if (!mounted || redirectingRef.current) return;
          const { data: { session: recheckedSession } } = await supabase.auth.getSession();
          if (!mounted) return;
          if (!recheckedSession) {
            redirectingRef.current = true;
            router.replace("/auth/login");
            return;
          }
          setSession(recheckedSession);
          setUser(recheckedSession.user ?? null);
        }, 200);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (!session && !redirectingRef.current) {
        redirectingRef.current = true;
        router.replace("/auth/login");
      }
    });

    return () => {
      mounted = false;
      if (redirectTimeoutId) clearTimeout(redirectTimeoutId);
      subscription.unsubscribe();
    };
  }, []);

  /* ── fetch analytics ── */
  useEffect(() => {
    if (!user) return;
    fetchAnalytics();
  }, [user, range]);

  async function fetchAnalytics() {
    setAnalyticsLoading(true);
    try {
      const since = range === 0
        ? new Date(0).toISOString()
        : new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString();

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // Parallel queries
      const [
        { data: allVisits },
        { data: todayVisits },
        { data: recentVisits },
        { data: topPages },
        { data: devices },
        { data: countries },
      ] = await Promise.all([
        supabase
          .from("page_visits")
          .select("id", { count: "exact", head: true })
          .gte("visited_at", since),

        supabase
          .from("page_visits")
          .select("id", { count: "exact", head: true })
          .gte("visited_at", todayStart.toISOString()),

        supabase
          .from("page_visits")
          .select("page_path, country, device_type, browser, visited_at")
          .gte("visited_at", since)
          .order("visited_at", { ascending: false })
          .limit(20),

        supabase
          .from("page_visits")
          .select("page_path")
          .gte("visited_at", since),

        supabase
          .from("page_visits")
          .select("device_type")
          .gte("visited_at", since),

        supabase
          .from("page_visits")
          .select("country")
          .gte("visited_at", since),
      ]);

      // Aggregate top pages
      const pageCount = {};
      (topPages || []).forEach(({ page_path }) => {
        const k = page_path || "/";
        pageCount[k] = (pageCount[k] || 0) + 1;
      });
      const topPagesArr = Object.entries(pageCount)
        .map(([page_path, count]) => ({ page_path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      // Device breakdown
      const deviceCount = { desktop: 0, mobile: 0, tablet: 0 };
      (devices || []).forEach(({ device_type }) => {
        if (device_type in deviceCount) deviceCount[device_type]++;
      });

      // Top countries
      const countryCount = {};
      (countries || []).forEach(({ country }) => {
        if (!country) return;
        countryCount[country] = (countryCount[country] || 0) + 1;
      });
      const topCountriesArr = Object.entries(countryCount)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setAnalytics({
        total: allVisits?.length ?? 0,
        today: todayVisits?.length ?? 0,
        recentVisits: recentVisits || [],
        topPages: topPagesArr,
        devices: deviceCount,
        topCountries: topCountriesArr,
      });
    } catch (err) {
      console.error("[analytics]", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020817" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px", height: "40px", border: "3px solid #1e293b", borderTopColor: "#6366f1",
            borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto",
          }} />
          <p style={{ marginTop: "16px", color: "#64748b", fontSize: "14px" }}>Loading dashboard…</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session || !user) return null;

  const deviceTotal = analytics
    ? analytics.devices.desktop + analytics.devices.mobile + analytics.devices.tablet
    : 0;

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .dash-card { animation: fadeUp 0.4s ease both; }
        .range-btn { cursor: pointer; border: 1px solid #1e293b; background: transparent; color: #64748b; padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .range-btn.active { background: #6366f1; border-color: #6366f1; color: #fff; }
        .range-btn:hover:not(.active) { border-color: #334155; color: #cbd5e1; }
        .recent-row:hover { background: #0f172a !important; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020817 0%, #0a0f1e 50%, #020817 100%)",
        padding: "32px 20px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* ── header ── */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            marginBottom: "36px", flexWrap: "wrap", gap: "16px",
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "30px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                📊 Analytics Dashboard
              </h1>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
                Logged in as <span style={{ color: "#a5b4fc" }}>{user.email}</span>
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <a href="/admin/events" style={{
                padding: "9px 18px", background: "#0f172a",
                border: "1px solid #6366f1",
                borderRadius: "10px", color: "#a5b4fc", fontSize: "13px", fontWeight: "600",
                textDecoration: "none",
              }}>⚡ Events</a>
              <a href="/admin/messages" style={{
                padding: "9px 18px", background: "#6366f1",
                borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600",
                textDecoration: "none", border: "none",
              }}>Messages</a>
              <button
                onClick={handleLogout}
                style={{
                  padding: "9px 18px", background: "transparent",
                  border: "1px solid #ef4444", borderRadius: "10px",
                  color: "#ef4444", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                }}
              >Logout</button>
            </div>
          </div>

          {/* ── range selector ── */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#64748b", marginRight: "4px" }}>Period:</span>
            {[
              { label: "Last 7 days", val: 7 },
              { label: "Last 30 days", val: 30 },
              { label: "All time", val: 0 },
            ].map(({ label, val }) => (
              <button
                key={val}
                className={`range-btn${range === val ? " active" : ""}`}
                onClick={() => setRange(val)}
              >{label}</button>
            ))}
            {analyticsLoading && (
              <div style={{
                width: "18px", height: "18px",
                border: "2px solid #1e293b", borderTopColor: "#6366f1",
                borderRadius: "50%", animation: "spin 0.8s linear infinite", marginLeft: "8px",
              }} />
            )}
          </div>

          {/* ── stat cards ── */}
          <div className="dash-card" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}>
            <StatCard icon="👁️" label="Total Visits" value={fmtNum(analytics?.total)} color="#6366f1" />
            <StatCard icon="📅" label="Visits Today" value={fmtNum(analytics?.today)} color="#22d3ee" />
            <StatCard icon="💻" label="Desktop" value={fmtNum(analytics?.devices.desktop)} color="#a3e635" />
            <StatCard icon="📱" label="Mobile" value={fmtNum(analytics?.devices.mobile)} color="#f59e0b" />
            <StatCard icon="🌍" label="Countries" value={analytics?.topCountries.length ?? 0} color="#ec4899" />
          </div>

          {/* ── middle row: top pages + devices + countries ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

            {/* top pages */}
            <div className="dash-card" style={{
              background: "#0a1628", border: "1px solid #1e293b",
              borderRadius: "16px", padding: "24px",
              animationDelay: "0.05s",
            }}>
              <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#f1f5f9" }}>
                🔥 Top Pages
              </h2>
              <BarChart data={analytics?.topPages} color="#6366f1" />
            </div>

            {/* devices + countries */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* device breakdown */}
              <div className="dash-card" style={{
                background: "#0a1628", border: "1px solid #1e293b",
                borderRadius: "16px", padding: "24px", flex: 1,
                animationDelay: "0.1s",
              }}>
                <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700", color: "#f1f5f9" }}>
                  📱 Devices
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { label: "Desktop", key: "desktop", color: "#a3e635" },
                    { label: "Mobile", key: "mobile", color: "#f59e0b" },
                    { label: "Tablet", key: "tablet", color: "#22d3ee" },
                  ].map(({ label, key, color }, idx) => (
                    <DonutSlice
                      key={key}
                      label={label}
                      value={analytics?.devices[key] ?? 0}
                      count={analytics?.devices[key] ?? 0}
                      total={deviceTotal}
                      color={color}
                      idx={idx}
                    />
                  ))}
                </div>
              </div>

              {/* top countries */}
              <div className="dash-card" style={{
                background: "#0a1628", border: "1px solid #1e293b",
                borderRadius: "16px", padding: "24px", flex: 1,
                animationDelay: "0.15s",
              }}>
                <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700", color: "#f1f5f9" }}>
                  🌍 Top Countries
                </h2>
                {analytics?.topCountries.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {analytics.topCountries.map(({ country, count }) => (
                      <div key={country} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "8px 12px", background: "#0f172a",
                        borderRadius: "8px", border: "1px solid #1e293b",
                      }}>
                        <span style={{ fontSize: "13px", color: "#cbd5e1" }}>{country}</span>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#a5b4fc" }}>{fmtNum(count)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "#475569", fontSize: "13px" }}>No country data yet</div>
                )}
              </div>
            </div>
          </div>

          {/* ── recent visits table ── */}
          <div className="dash-card" style={{
            background: "#0a1628", border: "1px solid #1e293b",
            borderRadius: "16px", padding: "24px",
            animationDelay: "0.2s",
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#f1f5f9" }}>
              🕒 Recent Visits
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr>
                    {["Page", "Country", "Device", "Browser", "Time"].map((h) => (
                      <th key={h} style={{
                        textAlign: "left", padding: "10px 12px",
                        color: "#64748b", fontWeight: "600", fontSize: "11px",
                        textTransform: "uppercase", letterSpacing: "0.06em",
                        borderBottom: "1px solid #1e293b",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analytics?.recentVisits.length ? (
                    analytics.recentVisits.map((v, i) => (
                      <tr key={i} className="recent-row" style={{ borderBottom: "1px solid #0f172a" }}>
                        <td style={{ padding: "10px 12px", color: "#a5b4fc", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {v.page_path || "/"}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{v.country || "—"}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{
                            background: v.device_type === "mobile" ? "#451a03" : v.device_type === "tablet" ? "#0c1a3a" : "#14290d",
                            color: v.device_type === "mobile" ? "#fb923c" : v.device_type === "tablet" ? "#38bdf8" : "#84cc16",
                            padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                          }}>
                            {v.device_type || "unknown"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{v.browser || "—"}</td>
                        <td style={{ padding: "10px 12px", color: "#64748b", whiteSpace: "nowrap" }}>
                          {v.visited_at ? new Date(v.visited_at).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#475569" }}>
                        No visits recorded yet — start browsing your portfolio!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── quick nav ── */}
          <div className="dash-card" style={{
            marginTop: "20px",
            background: "#0a1628", border: "1px solid #1e293b",
            borderRadius: "16px", padding: "20px",
            display: "flex", gap: "12px", flexWrap: "wrap",
            animationDelay: "0.25s",
          }}>
            <span style={{ fontSize: "13px", color: "#64748b", alignSelf: "center" }}>Quick nav:</span>
            {[
              { label: "📝 Messages", href: "/admin/messages" },
              { label: "⚡ Events Monitor", href: "/admin/events" },
              { label: "📄 Page Builder", href: "/admin/page-builder" },
              { label: "🏠 Portfolio", href: "/" },
            ].map(({ label, href }) => (
              <a key={href} href={href} style={{
                padding: "8px 16px", background: "#1e293b",
                borderRadius: "8px", color: "#cbd5e1", fontSize: "13px",
                textDecoration: "none", fontWeight: "500",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#334155"}
                onMouseLeave={e => e.currentTarget.style.background = "#1e293b"}
              >{label}</a>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
