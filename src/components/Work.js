import React from "react";
import "../styles//Work.css";
import Card from "./Card.js";
import { EXPERIENCEDATA } from "./Data.js";
import CustomTitle from "./Items/CustomTitle.js";
import ExperienceCard from "./Items/ExperienceCard.js";
import Timeline from "./Timeline.js";

const Work = () => {
  const Data = EXPERIENCEDATA;

  return (
    <section
      className="Work container section"
      id="work"
    >
      <ExperienceCard />
      {/* <Timeline /> */}

      <div className="section__title text-white">
        <CustomTitle
          subheading=""
          mainText="Education &"
          highlightedText="Experience"
        />
      </div>

      <div className="Work__container grid">
        <div className="timeline grid">
          {Data.map((val, index) => {
            if (val.category === "experience") {
              return (
                <Card
                  key={index}
                  icon={val.icon}
                  title={val.title}
                  year={val.year}
                  desc={val.desc}
                />
              );
            }
          })}
        </div>
        <div className="timeline grid">
          {Data.map((val, id) => {
            if (val.category === "education") {
              return (
                <Card
                  key={id}
                  icon={val.icon}
                  title={val.title}
                  year={val.year}
                  desc={val.desc}
                />
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};

export default Work;
