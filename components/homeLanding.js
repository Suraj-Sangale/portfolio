import React from "react";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import homeStyle from "../styles/home.module.css";
import { getConstant } from "@/utilities/utils";
import Image from "next/image";
import Link from "next/link";

const HomeLanding = () => {
  const socialLinks = [
    {
      url: getConstant("LINKDIN_URL"),
      icon: <FaLinkedin />,
      label: "LinkedIn",
      className: "linkedin",
    },
    {
      url: getConstant("GIT_URL"),
      className: "github",
      icon: <FaGithub />,
      label: "GitHub",
    },
    {
      url: getConstant("TWITTER_URL"),
      className: "twitter",
      icon: <FaTwitter />,
      label: "Twitter",
    },
    {
      url: getConstant("INSTAGRAM_URL"),
      icon: <FaInstagram />,
      label: "Instagram",
      className: "instagram",
    },
    { url: getConstant("FB_URL"), icon: <FaFacebook />, label: "Facebook" },
  ];

  return (
    <>
      <section
        className={homeStyle.home}
        id="home"
      >
        <div
          className={`${homeStyle.intro} ${homeStyle.hoverParentX} flex-col-reverse md:flex-row-reverse justify-evenly  flex`}
        >
          <div className="">
            <Image
              src="/developer.png"
              alt="Suraj Sangale"
              height={400}
              width={400}
              loading="lazy"
            />
          </div>
          <div className="items-center mb-10 md:mb-0">
            <h1 className={`${homeStyle.home__name} text-white`}>
              Hi, I am Suraj Sangale
            </h1>
            <div
              className={`${homeStyle.hoverParentX} hover:decoration-pink-500 text-white`}
            >
              I am a Software Developer
            </div>

            <div className="flex justify-center mt-4 gap-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={homeStyle.socialLinks}
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </section >
      {/* <button onClick={scrollToTop}>Scroll to Top</button> */}
    </>
  );
};

export default HomeLanding;
