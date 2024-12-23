import React from "react";
import "../styles//Work.css";
import Card from "./Card.js";
import { EXPERIENCEDATA } from "./Data.js";

const Work = () => {
  const Data = EXPERIENCEDATA;

  return (
    <section
      className="Work container section"
      id="work"
    >
      <h2 className="section__title text-white">Experience</h2>

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
