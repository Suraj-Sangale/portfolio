import React from "react";
import "../../styles/projects.css";

export default function MyProjectsCard({ item }) {
  const {
    title = "",
    description = "",
    image = "",
    gitUrl = "",
    liveUrl = "",
    keyFeatures,
  } = item;

  return (
    <div className="projectCard bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
      <img
        alt={title}
        src={"/myProjects/" + image}
        loading="lazy"
        height={400}
        width={400}
        className="w-full h-full object-contain rounded "
      />
      <div className="card__content p-3">
        <p className="card__title">{title}</p>
        <p className="card__description mb-2">{description}</p>
        <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
        <ul className="list-disc list-inside mb-2">
          {keyFeatures &&
            keyFeatures.map((feature) => (
              <li
                key={feature.id}
                className="flex items-start gap-2 transition-colors duration-300"
              >
                <span className="flex-shrink-0 w-2 h-2 mt-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></span>
                <span className="font-medium">{feature.text}</span>
              </li>
            ))}
        </ul>
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
