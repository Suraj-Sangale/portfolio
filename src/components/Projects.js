import React from "react";
import "../styles/projects.css";
import CustomTitle from "./Items/CustomTitle";
import MyProjectsCard from "./Items/MyProjectsCard";
import ProjectCard from "./Items/projectCard";

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const setHovered = (state, index = null) => {
    setHoveredIndex(state ? index : null);
  };

  const MY_PROJECTS = [
    {
      title: "Urban Market",
      description:
        "I built a fully responsive clone of Urban Marketplace, a modern e-commerce platform where users can explore a wide variety of products, add items to their cart, and seamlessly place orders.",
      keyFeatures: [
        { id: 1, text: "Modern and responsive UI for smooth product browsing" },
        { id: 2, text: "Add to cart and complete checkout functionality" },
        {
          id: 3,
          text: "Built with React.js and Tailwind CSS, deployed on Netlify",
        },
        { id: 1, text: "Modern and responsive UI for smooth product browsing" },
        { id: 2, text: "Add to cart and complete checkout functionality" },
        {
          id: 3,
          text: "Built with React.js and Tailwind CSS, deployed on Netlify",
        },
      ],

      techStack: ["Next.js", "Tailwind CSS", "Node.js"],
      image: "UrbanMarket.png",
      gitUrl: "https://github.com/Suraj-Sangale/urban-market",
      liveUrl: "https://urbanmarketplace.netlify.app/home",
    },
    {
      title: "Point Stream Panel",
      description:
        "Developed a web-based platform to efficiently manage sports tournaments and matches.Key features include match setup booths, real-time scoreboard updates, multi-referee score management, and match history tracking.",
      keyFeatures: [
        {
          id: 1,
          text: "Optimized performance with server-side rendering (SSR) and static site generation (SSG).",
        },
        {
          id: 2,
          text: "Built backend API with JWT auth, WebSocket support, and MySQL integration.",
        },
        {
          id: 3,
          text: "Enabled real-time score updates from multiple referees for accurate match tracking.",
        },
      ],

      techStack: ["Next.js", "Tailwind CSS", "Node.js"],
      image: "PSPboard.png",
      liveUrl: "https://board.agni-byte.com",
    },
    {
      title: "Memo Mind",
      description:
        "A web-based platform designed to enhance memory retention and learning through interactive flashcards and quizzes. Users can create, share, and study flashcards on various topics, making learning engaging and effective.",
      keyFeatures: [
        { id: 1, text: "Create and share flashcards for effective learning" },
        { id: 2, text: "Interactive quizzes to reinforce knowledge retention" },
        {
          id: 3,
          text: "User-friendly interface for easy navigation and study",
        },
      ],

      techStack: ["Next.js", "Tailwind CSS", "Node.js"],
      image: "memoMind.png",
      liveUrl: "https://memo-mind-self.vercel.app",
    },
  ];
  return (
    <div
      className="proj section relative"
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
      <div className="my_project_wrapper m-[4%] ">
        <div
          className={`flex flex-wrap justify-center items-center gap-8 projectCardWrapper ${
            hoveredIndex ? "hover-active" : ""
          }`}
          onMouseLeave={() => setHovered(false)}
        >
          {MY_PROJECTS.map((item, index) => (
            <div
              key={index}
              // className={`projectCard ${
              //   hoveredIndex !== null && hoveredIndex !== index ? "blurred" : ""
              // }`}
              // onMouseEnter={() => setHovered(true, index)}
              // onMouseLeave={() => setHovered(false, null)}
            >
              <ProjectCard
                project={item}
                key={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
