import Link from "next/link";
import React from "react";

export default function Footer({ footer }) {
  if (!footer) {
    footer = {
      logo: "SURAJ SANGALE",
      tagline: "Full Stack Developer",
      links: [
        { label: "GitHub", href: "https://github.com/Suraj-Sangale" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/suraj-sangale/" },
        { label: "Resume", href: "/suraj_full_stack_developer.pdf" },
        { label: "Contact", href: "/contact" },
      ],
      copy: "© 2026 — Crafted in React, Next.js & raw ambition",
    };
  }

  return (
    <>
      <footer>
        <div className="f-top">
          <div className="f-brand">
            <Link href="/" className="fl">{footer.logo}</Link>
            {footer.tagline && <span className="f-tag">{footer.tagline}</span>}
          </div>

          <div className="fm-links">
            {footer.links.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="f-divider" />

        <div className="f-bottom">
          <div className="fr">{footer.copy}</div>
          <button
            className="f-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            ↑ Top
          </button>
        </div>
      </footer>

      <style jsx>{`
        footer {
          padding: 56px 52px 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          z-index: 10;
        }

        .f-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 24px;
        }

        .f-brand {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .fl {
          font-family: var(--fh, "Anton", sans-serif);
          font-size: 1.6rem;
          letter-spacing: 0.22em;
          background: linear-gradient(
            135deg,
            var(--c1, #00f5ff),
            var(--c3, #7400ff)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          width: fit-content;
        }

        .f-tag {
          font-family: var(--fm, "Space Mono", monospace);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(140, 149, 199, 0.5);
        }

        .fm-links {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }

        .fm-links a {
          position: relative;
          font-family: var(--fm, "Space Mono", monospace);
          font-size: 0.85rem;
          letter-spacing: 0.16em;
          color: var(--dim, #8c95c7);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.3s;
          padding-bottom: 4px;
        }

        .fm-links a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 1px;
          background: var(--c1, #00f5ff);
          transition: width 0.3s ease;
        }

        .fm-links a:hover {
          color: var(--c1, #00f5ff);
        }

        .fm-links a:hover::after {
          width: 100%;
        }

        .f-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 40px 0 20px;
        }

        .f-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .fr {
          font-family: var(--fm, "Space Mono", monospace);
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          color: rgba(80, 83, 102, 0.6);
        }

        .f-top-btn {
          font-family: var(--fm, "Space Mono", monospace);
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          padding: 6px 14px;
          color: var(--dim, #8c95c7);
          cursor: pointer;
          transition: all 0.3s;
        }

        .f-top-btn:hover {
          color: var(--c1, #00f5ff);
          border-color: var(--c1, #00f5ff);
        }

        @media (max-width: 900px) {
          footer {
            padding: 40px 24px 24px;
          }

          .f-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .fm-links {
            gap: 20px;
          }

          .f-bottom {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}