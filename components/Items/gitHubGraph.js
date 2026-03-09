import { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";

export default function GitHubGraph() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loaded, setLoaded] = useState(false);
  const [sizeConfig, setSizeConfig] = useState({
    blockSize: 13,
    blockMargin: 4,
    fontSize: 14,
  });

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, [selectedYear]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSizeConfig({ blockSize: 9, blockMargin: 2, fontSize: 11 });
      } else if (width < 1024) {
        setSizeConfig({ blockSize: 10, blockMargin: 3, fontSize: 13 });
      } else {
        setSizeConfig({ blockSize: 13, blockMargin: 4, fontSize: 14 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .gh-wrapper {
          font-family: 'Syne', sans-serif;
          background: #0d1117;
          border: 1px solid #21262d;
          border-radius: 16px;
          padding: 36px 40px;
          position: relative;
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
        }

        .gh-wrapper::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, rgba(46,160,67,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .gh-wrapper::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(46,160,67,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .gh-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .gh-title-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gh-icon {
          width: 36px;
          height: 36px;
          background: #21262d;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #30363d;
        }

        .gh-icon svg {
          fill: #e6edf3;
          width: 20px;
          height: 20px;
        }

        .gh-title {
          font-size: 18px;
          font-weight: 700;
          color: #e6edf3;
          letter-spacing: -0.3px;
          margin: 0;
          line-height: 1;
        }

        .gh-username {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #3fb950;
          margin-top: 4px;
          letter-spacing: 0.5px;
        }

        .gh-year-tabs {
          display: flex;
          gap: 6px;
          background: #161b22;
          padding: 4px;
          border-radius: 10px;
          border: 1px solid #21262d;
        }

        .gh-year-tab {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          transition: all 0.18s ease;
          color: #7d8590;
          background: transparent;
          letter-spacing: 0.3px;
        }

        .gh-year-tab:hover {
          color: #c9d1d9;
          background: #21262d;
        }

        .gh-year-tab.active {
          background: #238636;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 0 12px rgba(35,134,54,0.4);
        }

        .gh-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #21262d 20%, #21262d 80%, transparent);
          margin-bottom: 28px;
        }

        .gh-calendar-container {
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: 0;
          transform: translateY(6px);
        }

        .gh-calendar-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .gh-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .gh-stat-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 20px;
          padding: 5px 12px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #7d8590;
        }

        .gh-stat-dot {
          width: 7px;
          height: 7px;
          border-radius: 2px;
          background: #3fb950;
        }

        .gh-learn-more {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #3fb950;
          text-decoration: none;
          opacity: 0.7;
          transition: opacity 0.15s;
        }

        .gh-learn-more:hover {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .gh-wrapper {
            padding: 20px 16px;
            border-radius: 12px;
          }
          .gh-year-tabs {
            flex-wrap: wrap;
          }
          .gh-year-tab {
            padding: 5px 10px;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="gh-wrapper">
        {/* Header */}
        <div className="gh-header">
          <div className="gh-title-block">
            <div className="gh-icon">
              <svg viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <div>
              <div className="gh-title">Contributions</div>
              <div className="gh-username">@Suraj-Sangale</div>
            </div>
          </div>

          {/* Year Tabs */}
          <div className="gh-year-tabs">
            {years.map((year) => (
              <button
                key={year}
                className={`gh-year-tab ${selectedYear === year ? "active" : ""}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="gh-divider" />

        {/* Calendar */}
        <div className={`gh-calendar-container ${loaded ? "visible" : ""}`}>
          <div style={{ overflowX: "auto" }}>
            <GitHubCalendar
              key={selectedYear}
              username="Suraj-Sangale"
              year={selectedYear}
              blockSize={sizeConfig.blockSize}
              blockMargin={sizeConfig.blockMargin}
              fontSize={sizeConfig.fontSize}
              colorScheme="dark"
              theme={{
                dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#3fb950"],
              }}
            />
          </div>
        </div>

        {/* Footer 
        <div className="gh-footer">
          <div className="gh-stat-badge">
            <div className="gh-stat-dot" />
            {selectedYear} activity
          </div>
          
            href={`https://github.com/Suraj-Sangale`}
            target="_blank"
            rel="noreferrer"
            className="gh-learn-more"
          >
            view profile →
          </a>
        </div>*/}
      </div>
    </>
  );
}
