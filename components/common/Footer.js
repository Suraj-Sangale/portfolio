import React from "react";

export default function Footer({ footer }) {
  if (!footer) {
    footer = {
      logo: "SURAJ SANGALE",
      links: [
        { label: "GitHub", href: "https://github.com/Suraj-Sangale" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/suraj-sangale/" },
        { label: "Resume", href: "/suraj_sangale_resume.pdf" },
        {label:"Contact",href:"/contact"}
      ],
      copy: "© 2026 — Crafted in React, Next.js & raw ambition",
    };
  }

  return (
    <>
      <footer>
        <div className="fl">{footer.logo}</div>
        <div className="fm-links">
          {footer.links.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="fr">{footer.copy}</div>
      </footer>

      <style jsx>{`
        footer {
          padding: 36px 52px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .fl {
          font-family: var(--fh, "Anton", sans-serif);
          font-size: 1.4rem;
          letter-spacing: 0.25em;
          background: linear-gradient(
            135deg,
            var(--c1, #00f5ff),
            var(--c3, #7400ff)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .fr {
          font-family: var(--fm, "Space Mono", monospace);
          font-size: .6rem;
          letter-spacing: 0.15em;
          color: rgba(80, 83, 102, 0.6);
        }

        .fm-links {
          display: flex;
          gap: 28px;
        }

        .fm-links a {
          font-family: var(--fm, "Space Mono", monospace);
          font-size: 1rem;
          letter-spacing: 0.18em;
          color: var(--dim, #8c95c7ff);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.3s;
        }

        .fm-links a:hover {
          color: var(--c1, #00f5ff);
        }

        @media (max-width: 900px) {
          footer {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
