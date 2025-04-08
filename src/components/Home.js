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

// this is test only add images 
  
  return (
    <div className="">
      <section
        className="home"
        id="home"
      >
        <div className="intro flex flex-col-reverse md:flex-row-reverse justify-evenly hover-parent	">
          <div className="">
            <img
              alt="Suraj Sangale"
              // src="https://i.ibb.co/bBmCf3p/new-prof.png"
              src="/developer.png"
              height={400}
              width={400}
              // className="z-20"
            />
          </div>
          <div className="items-center mb-10 md:mb-0">
            <h1 className="home__name text-white">Hi, I am Suraj Sangale</h1>
            <div className="underline-hover hover:decoration-pink-500 text-white">
              I am a Software Developer
            </div>
            
          {/* <a
            href="#contact"
            className="btn mt-2"
          >
            Hire Me
          </a> */}
          {/* <div className="flex space-x-4 mt-4 socialIcons">
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
          </div> */}
          </div>
        </div>
      </section>
      {/* <button onClick={scrollToTop}>Scroll to Top</button> */}
    </div>
  );
};

export default Home;
