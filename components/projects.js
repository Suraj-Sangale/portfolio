import React, { useState } from "react";
import CustomTitle from "./Items/CustomTitle";
import ProjectCard from "./Items/projectCard";
import { useRouter } from "next/router";
import { FilterSwitch } from "./Items/filterSwitch";
import Switch from "./common/switch";

export default function Projects({ pageData }) {
  // const projects = getProjects(pageData);
  const { projectsData } = pageData || {};
  const sectionTitle = pageData?.sections?.projects || {};

  const router = useRouter();
  const { query = {} } = router;
  const { slug = "" } = query;
  console.log("slug", slug);

  const activeSlug = slug;
  const projectsData1 = [
    { id: 1, name: "Portfolio", type: "personal" },
    { id: 2, name: "Client Dashboard", type: "professional" },
    { id: 3, name: "Blog App", type: "personal" },
    { id: 4, name: "Company Website", type: "professional" },
  ];

  const [filter, setFilter] = useState("all");

  const filteredProjects =
    filter === "all"
      ? projectsData1
      : projectsData1.filter((p) => p.type === filter);

  return (
    <div
      className="relative my-20"
      id="projects"
    >
      <div className="md:ml-36">
        <div className="flex flex-row justify-between ">
          <CustomTitle
            subheading={projectsData.subheading}
            mainText={projectsData.mainText}
            highlightedText={projectsData.highlightedText}
          />
          <Switch />
        </div>
        {/* <div style={{ padding: "40px" }}>
          <FilterSwitch />
        </div> */}
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
