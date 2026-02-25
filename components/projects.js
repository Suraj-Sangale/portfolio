import React from "react";
import CustomTitle from "./Items/CustomTitle";
import ProjectCard from "./Items/projectCard";

export default function Projects({ pageData }) {
  // const projects = getProjects(pageData);
  const { projectsData } = pageData || {};
  const sectionTitle = pageData?.sections?.projects || {};

  return (
    <div
      className="section relative"
      id="projects"
    >
      <div className="md:ml-36">
        <CustomTitle
          subheading={projectsData.subheading}
          mainText={projectsData.mainText}
          highlightedText={projectsData.highlightedText}
        />
      </div>
      {/* <ProjectCard /> */}
      <div className="m-[4%] ">
        <div
          className={`flex flex-wrap justify-center gap-8 projectCardWrapper`}
        >
          {projectsData?.projectList?.length > 0 &&
            projectsData?.projectList?.map((item, index) => (
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
