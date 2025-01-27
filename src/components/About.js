import React, { useState, useEffect } from "react";
import "../styles/About.css";
import { aboutMeText, EXPERIENCEDATA, images, resumeLink } from "./Data";
import CustomTitle from "./Items/CustomTitle";
import ResumeModal from "./Items/ResumeModal";
import { BsFillHexagonFill } from "react-icons/bs";
import ExperienceCard from "./Items/ExperienceCard";
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

  const items = ["Item 1", "Item 2", "Item 3"]; // List of items

  return (
    <>
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
                className="icons relative overflow-hidden  flex flex-col justify-center items-center h-20 m-1 rounded-md transition-transform transform hover:scale-105"
              >
                <img
                  src={item.imgUrl}
                  alt="imgage not found"
                  className=" group  max-w-full object-cover transition-transform transform duration-300 group-hover:scale-120"
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
              className="mt-4 text-center style_button"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="button-content">View Resume</span>
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
      <div className="flex justify-center items-center min-h-screen card-container">
        <div className=" shadow-lg rounded-2xl p-6 w-96 md:w-[50rem] h-auto relative my-10">
          <ul className="relative flex flex-col items-center space-y-8">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-white border-l-2 border-gray-300"></div>
            {/* Dynamic list items */}
            {EXPERIENCEDATA.map((item, index) => (
              <li
                key={index}
                className={`relative text-gray-700 px-4 py-2 rounded-lg w-full md:w-5/12 text-center ${
                  index % 2 === 0
                    ? "md:self-start md:ml-0"
                    : "md:self-end md:mr-0"
                }`}
              >
                <div
                  className={`absolute hidden md:block ${
                    index % 2 === 0
                      ? "left-auto -right-[4.8rem]"
                      : "-left-[4.8rem] right-auto"
                  }`}
                >
                  <BsFillHexagonFill
                    color="red"
                    size={"25"}
                  />
                </div>

                <ExperienceCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default About;
