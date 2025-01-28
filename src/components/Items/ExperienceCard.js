import React from "react";

const ExperienceCard = ({ item, index }) => {
  const skills = ["Angular", "AngularJS", "SpringBoot", "Java"];

  return (
    <>
      {/*<div className={`company-info ${index % 2 === 0 && "justify-end"}`}>
        <span className="company-name">{item?.title}</span>
        <span className="duration">{item?.year}</span>
      </div>
       <button className="btn_company">
        New button
      </button> */}
      <div className="card">
        <div className={`flex ${index % 2 === 0 && "justify-end"}`}>
        <span className="company-name">{item?.title}</span>
          <span className="duration ml-3">{item?.year}</span>
        </div>
        <h3 className="card-title my-3">{item?.desc}</h3>
        <div className="skills">
          {item.skills &&
            item.skills.map((skill, index) => (
              <span
                className="skill"
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
