import React from "react";
import "../styles/projects.css";
import CustomTitle from "./Items/CustomTitle";
import MyProjectsCard from "./Items/MyProjectsCard";

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const setHovered = (state, index = null) => {
    setHoveredIndex(state ? index : null);
  };

  const projects = [
    {
      title: "Project 1",
      description: "Description of Project 1",
      image: "UrbanMarket.png",
      gitUrl: "https://i.ibb.co/bBmCf3p/new-prof.png",
      liveUrl: "https://i.ibb.co/bBmCf3p/new-prof.png",
    },
    {
      title: "Project 2",
      description: "Description of Project 2",
      image: "https://i.ibb.co/bBmCf3p/new-prof.png",
      liveUrl: "https://i.ibb.co/bBmCf3p/new-prof.png",
    },
    {
      title: "Project 3",
      description: "Description of Project 3",
      image: "https://i.ibb.co/bBmCf3p/new-prof.png",
    },
  ];
  return (
    <div
      className="about container section relative"
      id="projects"
    >
      <CustomTitle
        subheading="Projects"
        mainText="What"
        highlightedText="I've Done"
      />
      <div className="my_project_wrapper my-8 ">
        <div

          className={`  flex flex-wrap justify-center items-center gap-8 projectCardWrapper ${hoveredIndex ? "hover-active" : ""}`}
          onMouseLeave={() => setHovered(false)}
        >
          {projects.map((item, index) => (
            <div
              key={index}
              className={`projectCard ${
                hoveredIndex !== null && hoveredIndex !== index ? "blurred" : ""
              }`}
              onMouseEnter={() => setHovered(true, index)}
              onMouseLeave={() => setHovered(false, null)}
            >
              <MyProjectsCard
                item={item}
                key={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
