import React from "react";
import CustomTitle from "./Items/CustomTitle";
import ProjectCard from "./Items/projectCard";
import { useRouter } from "next/router";

export default function Projects({ pageData }) {
  // const projects = getProjects(pageData);
  const { projectsData } = pageData || {};
  const sectionTitle = pageData?.sections?.projects || {};

  const router = useRouter();
  const { query = {} } = router;
  const { slug = "" } = query;
  console.log("slug", slug);

  const activeSlug = slug;
  return (
    <div
      className="relative my-20"
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
          {projectsData?.projectList?.map((item, index) => {
            if (!item.isEnable) return null;

            const isDefaultOpen = item.slug === activeSlug;

            return (
              <ProjectCard
                key={index}
                project={item}
                isDefaultOpen={isDefaultOpen}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
