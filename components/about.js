import React, { useState, useEffect, use } from "react";
import { aboutMeText, images, resumeLink } from "../utilities/Data";
import ResumeModal from "./Items/ResumeModal";
import CustomTitle from "./Items/CustomTitle";
import aboutStyles from "../styles/about.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import GitHubGraph from "./Items/gitHubGraph";
import Ingredients from "./resumeSection";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (query.view_resume) {
      setIsModalOpen(true);
    }
  }, [query.view_resume]);

  useEffect(() => {
    if (isModalOpen) {
      // Disable scrolling on the body
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling on the body
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  const removeQuery = () => {
    // Removes query params without reloading the page
    router.replace(router.pathname, undefined, { shallow: true });
  };

  return (
    <>
      <div
        className="about container section relative"
        id="about"
      >
        {/* <h2 className="section__title text-white"></h2> */}

        <CustomTitle
          subheading="About"
          mainText="What I"
          highlightedText="Do"
        />

        <div className="mx-auto my-8 md:p-8 p-4 bg-gray-200 rounded-lg shadow-md w-88 md:w-10/12">
          <div className="mb-6">
            <p className="about__description">{aboutMeText}</p>
            <h2 className="section__subtitle text-slate-800 text-center">
              Skills
            </h2>
            <span className={aboutStyles.strokeme}>Send via WhatsApp</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((item, index) => (
              <div
                key={index}
                className="icons relative overflow-hidden  flex flex-col justify-center items-center h-22 m-0 rounded-md transition-transform transform duration-500 hover:scale-115"
              >
                <Image
                  src={item.imgUrl}
                  alt={item.name}
                  className="max-w-full object-cover"
                  style={{ maxHeight: "72%", maxWidth: "100%" }}
                  width={50}
                  height={50}
                  loading="lazy"
                />
                <p className="mb-1 text-center text-sm">{item.name}</p>
              </div>
            ))}
          </div>

          {/* <a
            href={"/resume.pdf"}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border px-3 py-1.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Open Fullscreen
          </a> */}
          <GitHubGraph />
          {/* <a
          href={resumeLink}
          target="_blank"
          className="btn mt-4 text-center"
        >
          Download Resume
        </a> */}

          <div>
            <button
              className={`mt-4 text-center ${aboutStyles.styleButton}`}
              onClick={() => setIsModalOpen(true)}
            >
              <span className={`${aboutStyles.viewResumeButton}`}>
                View Resume
              </span>
            </button>

            {/* Modal Component */}
            <ResumeModal
              show={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                removeQuery();
              }}
              resumeLink={resumeLink}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
