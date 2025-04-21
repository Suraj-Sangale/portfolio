import React from "react";
import "../../styles/projects.css";

export default function MyProjectsCard({ item }) {
  const {
    title = "",
    description = "",
    image = "",
    gitUrl = "",
    liveUrl = "",
  } = item;

  return (
    <div className="projectCard bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
      <img
        alt={title}
        src={"/myProjects/" + image}
        loading="lazy"
        height={400}
        width={400}
        className="w-full h-full object-cover"
      />
      <div className="card__content p-5">
        <p className="card__title text-xl font-semibold text-white mb-2">
          {title}
        </p>
        <p className="card__description text-gray-300 mb-4">{description}</p>
        <div className="flex space-x-4">
          {gitUrl && (
            <a
              href={gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500  hover:from-indigo-700 hover:to-purple-600 transition-colors text-white font-semibold text-sm shadow-md"
            >
              GitHub
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-gradient-to-r  from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-colors text-white font-semibold text-sm shadow-md"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
