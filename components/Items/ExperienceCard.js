import React from "react";
import workStyles from "@/styles/work.module.css";

const ExperienceCard = ({ item, index }) => {
  return (
    <>
      {/* <div className={`company-info ${index % 2 === 0 && "justify-end"}`}>
        <span className="company-name">{item?.title}</span>
        <span className="duration">{item?.year}</span>
      </div> */}

      <div className={`${workStyles.card}`}>
        <div
          className={`flex justify-center items-baseline ${
            index % 2 === 0 ? " md:justify-end" : " md:justify-start"
          }`}
        >
          <span className=" text-blue-500 text-lg">{item?.title}</span>
          <span className="ml-3 text-sm">{item?.year}</span>
        </div>
        {/* <div
          className={`flex ${index % 2 === 0 ? " md:flex-end" : " md:flex-start"} my-3`}
        >
          <h3>{item?.desc}</h3>
        </div> */}
        <h3 className={`${workStyles.cardTitle} my-3`}>{item?.desc}</h3>
        <div className={`${workStyles.skills}`}>
          {item.skills &&
            item.skills.map((skill, index) => (
              <span
                className={`${workStyles.skill}`}
                key={index}
              >
                {skill}
              </span>
            ))}
        </div>
      </div>
    </>
  );
};

export default ExperienceCard;
