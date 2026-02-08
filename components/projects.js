import React from "react";
import CustomTitle from "./Items/CustomTitle";
import ProjectCard from "./Items/projectCard";
import { getProjects, getSectionTitle } from "@/utilities/getPortfolioData";

export default function Projects() {
  const projects = getProjects();
  const sectionTitle = getSectionTitle("projects");
  
  return (
    <div
      className="section relative"
      id="projects"
    >
      <div className="md:ml-36">
        <CustomTitle
          subheading={sectionTitle.subheading}
          mainText={sectionTitle.mainText}
          highlightedText={sectionTitle.highlightedText}
        />
      </div>
      {/* <ProjectCard /> */}
      <div className="m-[4%] ">
        <div
          className={`flex flex-wrap justify-center gap-8 projectCardWrapper`}
        >
          {projects.map((item, index) => (
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
