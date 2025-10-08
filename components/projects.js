import React from "react";
import CustomTitle from "./Items/CustomTitle";
import ProjectCard from "./Items/projectCard";
import { MY_PROJECTS } from "@/utilities/Data";

export default function Projects() {
  return (
    <div
      className="section relative"
      id="projects"
    >
      <div className="md:ml-36">
        <CustomTitle
          subheading="Projects"
          mainText="What"
          highlightedText="I've Done"
        />
      </div>
      {/* <ProjectCard /> */}
      <div className="m-[4%] ">
        <div
          className={`flex flex-wrap justify-center gap-8 projectCardWrapper`}
        >
          {MY_PROJECTS.map((item, index) => (
            <React.Fragment key={index}>
              {item.isEnable && (
                <ProjectCard
                  key={index}
                  project={item}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
