import React, { useEffect, useState } from "react";
import CustomTitle from "./Items/CustomTitle";
import ProjectCard from "./Items/projectCard";
import { useRouter } from "next/router";
import { FilterSwitch } from "./Items/filterSwitch";
import { CommonToggle } from "./common/commonToggle";

export default function Projects({ pageData }) {
  const router = useRouter();
  // const projects = getProjects(pageData);
  const { projectsData } = pageData || {};
  const sectionTitle = pageData?.sections?.projects || {};
  const { projectList } = projectsData || {};

  const [displayProject, setDisplayProject] = useState(projectList);
  const [accentHue, setAccentHue] = useState(273);

  const { query = {} } = router;
  const { slug = "" } = query;
  console.log("slug", slug);

  const activeSlug = slug;

  const [filter, setFilter] = useState("all");

  const onChangeFilter = (index) => {
    if (index === 0) setFilter("all");
    else if (index === 1) setFilter("personal");
    else if (index === 2) setFilter("professional");
  };

  useEffect(() => {
    const filtered = projectList.filter((project) => {
      if (filter === "all") return true;
      return project.type === filter;
    });
    setDisplayProject(filtered);
  }, [filter]);

  return (
    <div
      className="relative my-20"
      id="projects"
    >
      <div className="md:ml-36">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CustomTitle
            subheading={projectsData.subheading}
            mainText={projectsData.mainText}
            highlightedText={projectsData.highlightedText}
          />

          <CommonToggle
            onChange={onChangeFilter}
            labels={[
              { id: 0, label: "All" },
              { id: 1, label: "Personal" },
              { id: 2, label: "Professional" },
            ]}
            accentHue={accentHue}
          />
          {/* <h1>{filter}</h1> */}
        </div>
        {/* <div style={{ padding: "40px" }}>
          <FilterSwitch />
        </div> */}
      </div>
      {/* <ProjectCard /> */}

      <div className="m-[4%] ">
        {/* <input
          type="number"
          name="accentHue"
          value={accentHue}
          onChange={(e) => setAccentHue(parseInt(e.target.value))}
        /> */}


        <div
          className={`flex flex-wrap justify-center gap-8 projectCardWrapper`}
        >
          {projectList.map((item, index) => {
            if (!item.isEnable) return null;

            console.log({ item: item, activeSlug });
            const isDefaultOpen = item.slug === activeSlug;

            return (
              <ProjectCard
                key={index}
                project={item}
                isDefaultOpen={isDefaultOpen}
                filter={filter}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
