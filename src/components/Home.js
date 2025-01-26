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
            <a
              href={getConstant("LINKDIN_URL")}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__icon"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={getConstant("GIT_URL")}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__icon"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={getConstant("TWITTER_URL")}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__icon"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href={getConstant("FB_URL")}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__icon"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href={getConstant("INSTAGRAM_URL")}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__icon"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </section>
      {/* <button onClick={scrollToTop}>Scroll to Top</button> */}
    </div>
  );
};

export default Home;
