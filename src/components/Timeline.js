import React from "react";
import { BsFillHexagonFill } from "react-icons/bs";
import ExperienceCard from "./Items/ExperienceCard";
import { EXPERIENCEDATA } from "./Data";

const Timeline = () => {
  return (
    <div className="flex justify-center items-center min-h-screen card-container">
      <h1 className="text-4xl font-bold mb-3 text-white">My Journey</h1>
      <p className="text-lg text-white">
        For more information, have a look at my
        <a
          className="text-blue-500 underline hover:text-blue-700 ml-1"
          target="_blank"
          rel="noreferrer"
        >
          curriculum vitae
        </a>
        .
      </p>
      <div className="w-96 md:w-[65rem] h-auto relative">
        <ul className="relative flex flex-col items-center space-y-8">
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-white border-l-2 border-gray-300"></div>
          {[...EXPERIENCEDATA].reverse().map((item, index) => (
            <li
              key={index}
              className={`relative text-gray-700 px-4 py-2 rounded-lg w-full md:w-[48%] text-center ${
                index % 2 === 0
                  ? "md:self-start md:ml-0"
                  : "md:self-end md:mr-0"
              }`}
            >
              <div
                className={`absolute hidden md:block ${
                  index % 2 === 0
                    ? "left-auto -right-[2rem]"
                    : "-left-[2rem] right-auto"
                }`}
              >
                <BsFillHexagonFill
                  color="red"
                  size={"25"}
                />
              </div>

              <ExperienceCard
                item={item}
                index={index}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
