import React from "react";
import CustomTitle from "./Items/CustomTitle";
import ProjectCard from "./Items/projectCard";

export default function Projects() {
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
        "A dynamic web-based platform built to streamline the management of sports tournaments, matches, and real-time scoring. Key highlights include match booth setups, referee-based access control, live scoreboard updates from multiple devices, detailed match history with obtained scores, and automated scorecard generation.",
      keyFeatures: [
        {
          id: 1,
          text: "Blazing-fast performance with Server-Side Rendering (SSR) and Static Site Generation (SSG) using Next.js.",
        },
        {
          id: 2,
          text: "Robust backend API with JWT authentication, WebSocket-powered real-time communication, and seamless MySQL database integration.",
        },
        {
          id: 3,
          text: "Real-time multi-referee scoring system with secured role-based access, ensuring accurate and transparent match updates.",
        },
      ],
      techStack: ["Next.js", "Tailwind CSS", "Socket.io", "MySQL", "Node.js"],
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
    {
      title: "Linux Tools",
      image: "linuxtools.png",
      liveUrl: "https://agni-byte.com/",
      description:
        "Built a comprehensive web-based toolkit tailored for DevOps engineers and system administrators to streamline server troubleshooting and daily operational tasks. The app integrates various diagnostic tools to enhance productivity and simplify common server-side challenges.",
      keyFeatures: [
        {
          id: 1,
          text: "DNS Checker to quickly verify domain records and identify misconfigurations",
        },
        {
          id: 2,
          text: "Port Scanner to detect open ports and assess network vulnerabilities",
        },
        {
          id: 3,
          text: "IP Lookup tool providing geolocation, ISP, and detailed IP data",
        },
        {
          id: 4,
          text: "Built-in Linux Command Library for instant access to essential terminal commands",
        },
        {
          id: 5,
          text: "Bonus tools like JSON Formatter, Text Comparator, and Server Diagnostics for enhanced productivity",
        },
      ],
      techStack: ["Next.js", "React", "PHP", "MariaDB", "Node.js"],
    },
  ];

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
            <ProjectCard
              project={item}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
