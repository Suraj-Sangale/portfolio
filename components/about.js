import React, { useState, useEffect } from "react";
import ResumeModal from "./Items/ResumeModal";
import CustomTitle from "./Items/CustomTitle";
import Image from "next/image";
import { useRouter } from "next/router";
import GitHubGraph from "./Items/gitHubGraph";
import CommonModal from "./common/commonModal";

const About = ({ pageData }) => {
  const { aboutData } = pageData;
  console.log("aboutData", aboutData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (query.view_resume) setIsModalOpen(true);
  }, [query.view_resume]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const removeQuery = () => {
    router.replace(router.pathname, undefined, { shallow: true });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Playfair+Display:ital,wght@1,400;1,500&display=swap');

        .glass-about {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          padding: 80px 0 120px;
          position: relative;
          overflow: hidden;
        }

        /* Animated mesh background */
        .glass-about::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(120, 80, 255, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 85% 30%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 50% 90%, rgba(236, 72, 153, 0.12) 0%, transparent 55%),
            radial-gradient(ellipse 70% 40% at 70% 60%, rgba(34, 211, 238, 0.08) 0%, transparent 50%);
          z-index: 0;
          pointer-events: none;
          animation: meshShift 12s ease-in-out infinite alternate;
        }

        @keyframes meshShift {
          0%   { opacity: 1; }
          50%  { opacity: 0.75; }
          100% { opacity: 1; }
        }

        /* Floating orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: orbFloat 15s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: rgba(139, 92, 246, 0.15);
          top: -100px; left: -100px;
          animation-duration: 18s;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: rgba(56, 189, 248, 0.12);
          top: 30%; right: -80px;
          animation-duration: 13s;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 350px; height: 350px;
          background: rgba(236, 72, 153, 0.1);
          bottom: 10%; left: 20%;
          animation-duration: 20s;
          animation-delay: -8s;
        }

        @keyframes orbFloat {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(30px, -20px) scale(1.05); }
          66%  { transform: translate(-20px, 30px) scale(0.97); }
          100% { transform: translate(20px, 10px) scale(1.02); }
        }

        .about-container {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }

        .about-container.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* — Glass card base — */
        .glass-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 24px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 32px 80px rgba(0,0,0,0.28),
            0 2px 0 rgba(255,255,255,0.08) inset;
          margin-top: 52px;
          overflow: hidden;
        }

        /* — Dividers — */
        .glass-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent);
        }

        /* — Bio — */
        .bio-block {
          padding: 44px 48px;
          position: relative;
        }

        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(167, 139, 250, 0.8);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-label::before {
          content: '';
          width: 18px;
          height: 1px;
          background: rgba(167, 139, 250, 0.6);
        }

        .bio-quote {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 19px;
          line-height: 1.8;
          color: rgba(255,255,255,0.72);
          max-width: 680px;
        }

        .bio-quote::before {
          content: '"';
          font-size: 60px;
          line-height: 0;
          vertical-align: -22px;
          margin-right: 4px;
          color: rgba(167, 139, 250, 0.3);
          font-family: 'Playfair Display', serif;
        }

        /* — Skills — */
        .skills-block {
          padding: 36px 48px;
        }

        .skills-heading {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .skills-heading::before {
          content: '';
          width: 3px;
          height: 14px;
          background: linear-gradient(180deg, #a78bfa, #38bdf8);
          border-radius: 2px;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
          gap: 10px;
        }

        .skill-tile {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 16px 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          cursor: default;
          transition: all 0.25s cubic-bezier(.22,1,.36,1);
          position: relative;
          overflow: hidden;
        }

        .skill-tile::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .skill-tile:hover {
          background: rgba(167,139,250,0.12);
          border-color: rgba(167,139,250,0.35);
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 12px 32px rgba(139,92,246,0.2), 0 0 0 1px rgba(167,139,250,0.2);
        }

        .skill-tile:hover::after {
          opacity: 1;
        }

        .skill-img-wrap {
          position: relative;
          z-index: 1;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .skill-name {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px;
          color: rgba(255,255,255,0.45);
          text-align: center;
          letter-spacing: 0.3px;
          line-height: 1.3;
          transition: color 0.2s;
        }

        .skill-tile:hover .skill-name {
          color: rgba(167,139,250,0.9);
        }

        /* — GitHub — */
        .github-block {
          padding: 36px 48px;
        }

        /* — Resume CTA — */
        .resume-block {
          padding: 32px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          background: linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(56,189,248,0.04) 100%);
          position: relative;
          overflow: hidden;
        }

        .resume-block::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.3) 40%, rgba(56,189,248,0.3) 60%, transparent);
        }

        .resume-text-hint {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.3px;
          line-height: 1.6;
        }

        .resume-text-hint strong {
          color: rgba(255,255,255,0.65);
          font-weight: 500;
        }

        .resume-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.85);
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
          padding: 12px 26px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(.22,1,.36,1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(8px);
        }

        .resume-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(167,139,250,0.25), rgba(56,189,248,0.2));
          opacity: 0;
          transition: opacity 0.25s;
        }

        .resume-btn:hover {
          border-color: rgba(167,139,250,0.5);
          color: #fff;
          box-shadow: 0 8px 32px rgba(139,92,246,0.25), 0 0 0 1px rgba(167,139,250,0.3);
          transform: translateY(-2px);
        }

        .resume-btn:hover::before { opacity: 1; }

        .resume-btn svg,
        .resume-btn span {
          position: relative;
          z-index: 1;
        }

        .resume-btn svg {
          width: 15px; height: 15px;
          fill: currentColor;
        }

        /* — Responsive — */
        @media (max-width: 640px) {
          .bio-block,
          .skills-block,
          .github-block,
          .resume-block {
            padding: 28px 20px;
          }
          .bio-quote { font-size: 16px; }
          .skills-grid { grid-template-columns: repeat(auto-fill, minmax(74px, 1fr)); gap: 8px; }
          .resume-block { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <section
        className="glass-about"
        id="about"
      >
        <div className={`about-container ${mounted ? "mounted" : ""}`}>
          <CustomTitle
            subheading={aboutData?.subheading || ""}
            mainText={aboutData?.mainText || ""}
            highlightedText={aboutData?.highlightedText || ""}
          />

          <div className="glass-card">
            {/* Bio */}
            <div className="bio-block">
              <div className="section-label">About me</div>
              <p className="bio-quote">{aboutData?.text}</p>
            </div>

            <div className="glass-divider" />

            {/* Skills */}
            {aboutData?.skills?.length > 0 && (
              <div className="skills-block">
                <div className="skills-heading">Tech Stack</div>
                <div className="skills-grid">
                  {aboutData.skills.map((item, index) => (
                    <div
                      key={index}
                      className="skill-tile"
                    >
                      <div className="skill-img-wrap">
                        <Image
                          src={item.imgUrl}
                          alt={item.name}
                          width={36}
                          height={36}
                          loading="lazy"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <span className="skill-name">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-divider" />

            {/* GitHub */}
            <div className="github-block">
              <div className="skills-heading">GitHub Activity</div>
              <GitHubGraph />
            </div>

            <div className="glass-divider" />

            {/* Resume CTA */}
            <div className="resume-block">
              <div className="resume-text-hint">
                <strong>Curious about my experience?</strong>
                <br />
                View my full résumé right here.
              </div>
              <button
                className="resume-btn"
                onClick={() => setIsModalOpen(true)}
              >
                <svg viewBox="0 0 16 16">
                  <path d="M4 0h5.5L14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2zm5 0v4h4L9 0zM4 7a1 1 0 000 2h8a1 1 0 000-2H4zm0 3a1 1 0 000 2h5a1 1 0 000-2H4z" />
                </svg>
                <span>View Résumé</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <ResumeModal
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          removeQuery();
        }}
        resumeLink={aboutData?.resumeLink}
      />

      <CommonModal
        // modalTitle={isEdit ? "Edit Page Data" : "Add New Page Data"}
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        modalSize={"w-11/12 md:w-4/6 bg-black/40  backdrop-blur-lg"}
        isDarkMode
      >
        <ResumeModal
          show={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            removeQuery();
          }}
          resumeLink={aboutData?.resumeLink}
        />
      </CommonModal>
    </>
  );
};

export default About;
