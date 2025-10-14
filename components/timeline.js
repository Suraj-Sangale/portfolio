import React from "react";
import { BsFillHexagonFill } from "react-icons/bs";
import ExperienceCard from "./Items/ExperienceCard";
import CustomTitle from "./Items/CustomTitle";
import { EXPERIENCEDATA } from "@/utilities/Data";
import workStyles from "@/styles/work.module.css";

const Timeline = () => {
  const expData = EXPERIENCEDATA;
  return (
    <div
      className="container section relative !mb-16"
      id="work"
    >
      <CustomTitle
        subheading="Work"
        mainText="My"
        highlightedText="Journey"
      />
      <div
        className={`${workStyles.cardContainer} flex justify-center items-center mt-8`}
      >
        <div className="w-96 md:w-[90vw] lg:w-[65rem] h-auto relative">
          <ul className="relative flex flex-col items-center space-y-8">
            <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 border-l-2 border-gray-300"></div>
            {expData
              .slice()
              .reverse()
              .map((item, index) => (
                <li
                  key={item.id || index}
                  className={`relative text-gray-700 rounded-lg w-full md:w-[48%] text-center ${
                    index % 2 === 0
                      ? "md:self-start md:ml-0"
                      : "md:self-end md:mr-0"
                  }`}
                >
                  <div
                    className={`absolute hidden md:block ${
                      index % 2 === 0
                        ? "left-auto -right-[2rem]"
                        : "-left-[2.2rem] right-auto"
                    }`}
                  >
                    <BsFillHexagonFill
                      color="#5c67f9"
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
    </div>
  );
};

export default Timeline;
