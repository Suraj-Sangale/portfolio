import React from "react";
import "../styles//Home.css";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { getConstant } from "../utils";

const Home = ({ scrollToTop }) => {
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
    <div className="homeBg">
      <section
        className="home container "
        id="home"
      >
        <div className="intro flex flex-col	items-center	">
          <div className="animate-drop">
            <img
              alt="Suraj Sangale"
              src="https://i.ibb.co/bBmCf3p/new-prof.png"
              height={185}
              width={140}
              className="z-20"
            />
          </div>
          <div>
            <h1 className="home__name text-white">Hi, I am Suraj Sangale</h1>
            <div className="underline decoration-pink-500/30 text-white">
              I am a Software Developer
            </div>
          </div>
          {/* <a
            href="#contact"
            className="btn mt-2"
          >
            Hire Me
          </a> */}
          <div className="flex space-x-4 mt-4 socialIcons">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__icon"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* <button onClick={scrollToTop}>Scroll to Top</button> */}
    </div>
  );
};

export default Home;
