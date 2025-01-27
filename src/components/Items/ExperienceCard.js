import React from "react";

const ExperienceCard = ({ item }) => {
  const skills = ["Angular", "AngularJS", "SpringBoot", "Java"];

  return (
    <>
      <div className="company-info">
        <span className="company-name">{item?.title}</span>
        <span className="duration">{item?.year}</span>
      </div>
      {/* <button className="btn_company">
        New button
      </button> */}
      <div className="card">
        <h3 className="card-title">{item?.desc}</h3>
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
