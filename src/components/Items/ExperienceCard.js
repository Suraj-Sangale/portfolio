import React from "react";

const ExperienceCard = () => {
  const skills = ["Angular", "AngularJS", "SpringBoot", "Java"];

  return (
    <div className="card-container">
      <div className="company-info">
        <span className="company-name">adorsys</span>
        <span className="duration">Sep 2020 - Present</span>
      </div>
      <div className="card">
        <h3 className="card-title">Software Developer</h3>
        <div className="skills">
          {skills.map((skill, index) => (
            <span
              className="skill"
              key={index}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
