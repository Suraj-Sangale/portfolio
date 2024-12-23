import React, { useState, useEffect } from "react";
import "../styles/About.css";
import { aboutMeText, images, resumeLink } from "./Data";
import CustomTitle from "./Items/CustomTitle";
import ResumeModal from "./Items/ResumeModal";
const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      // Disable scrolling on the body
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling on the body
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  return (
    <div
      className="about container section"
      id="about"
    >
      {/* <h2 className="section__title text-white"></h2> */}

      <CustomTitle
        subheading="About"
        mainText="What I"
        highlightedText="Do"
      />

      <div className=" mx-auto my-8 p-8 bg-white rounded-lg shadow-md w-10/12		">
        <div className="mb-6">
          <p className="about__description">{aboutMeText}</p>
          <h2 className="section__subtitle text-slate-800 text-center">
            Skills
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden  flex flex-col justify-center items-center h-20 m-1 rounded-md transition-transform transform hover:scale-105"
            >
              <img
                src={item.imgUrl}
                alt="imgage not found"
                className="icons group  max-w-full object-cover transition-transform transform duration-300 group-hover:scale-120"
                style={{ maxHeight: "72%", maxWidth: "100%" }}
              />
              <p className="mb-1 text-center text-sm">{item.name}</p>
            </div>
          ))}
        </div>
        {/* <a
          href={resumeLink}
          target="_blank"
          className="btn mt-4 text-center"
        >
          Download Resume
        </a> */}
        <div>
          <button
            className="btn mt-4 text-center"
            onClick={() => setIsModalOpen(true)}
          >
            View Resume
          </button>

          {/* Modal Component */}
          <ResumeModal
            show={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            resumeLink={resumeLink}
          />
        </div>
      </div>
    </div>
  );
};

export default About;
