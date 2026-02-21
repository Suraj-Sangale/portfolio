import React, { useState } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import homeStyle from "../styles/home.module.css";
import Image from "next/image";
import Link from "next/link";

// Icon mapping
const iconMap = {
  FaLinkedin: FaLinkedin,
  FaGithub: FaGithub,
  FaTwitter: FaTwitter,
  FaFacebook: FaFacebook,
  FaInstagram: FaInstagram,
};

const HomeLanding = ({ pageData }) => {
  const personalInfo = pageData.personal || {};
  const socialLinksData = pageData.socialLinks || [];

  const socialLinks = socialLinksData
    .map((link) => {
      const IconComponent = iconMap[link.icon] || null;
      return {
        url: link.url,
        icon: IconComponent ? <IconComponent /> : null,
        label: link.platform,
        className: link.className || "",
      };
    })
    .filter((link) => link.icon !== null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleHover = (url, index) => {
    setHoveredIndex(index);
    // Attempt to copy (will likely fail silently unless click)
    navigator.clipboard?.writeText(url).catch(() => {});
  };

  return (
    <>
      <section
        className={homeStyle.home}
        id="home"
      >
        <div
          className={`${homeStyle.intro} ${homeStyle.hoverParentX} flex-col-reverse md:flex-row-reverse justify-evenly flex`}
        >
          <div>
            <Image
              src={personalInfo.profileImage}
              alt={personalInfo.name}
              height={400}
              width={400}
              loading="lazy"
            />
          </div>
          <div className="items-center mb-10 md:mb-0">
            <h1 className={`${homeStyle.home__name} text-white`}>
              {personalInfo.greeting} {personalInfo.name}
            </h1>
            <div
              className={`${homeStyle.hoverParentX} hover:decoration-pink-500 text-white`}
            >
              {personalInfo.description}
            </div>

            <div className="flex justify-center mt-4 gap-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  onMouseEnter={() => handleHover(link.url, index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative group text-2xl"
                >
                  {link.icon}
                  <span
                    className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs rounded-md px-2 py-1 transition-all duration-200 pointer-events-none
              ${
                hoveredIndex === index
                  ? "bg-blue-900 text-white opacity-100"
                  : "opacity-0"
              }
            `}
                  >
                    Copied!
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* <button onClick={scrollToTop}>Scroll to Top</button> */}
    </>
  );
};

export default HomeLanding;
