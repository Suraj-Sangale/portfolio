import React from "react";
import "../../styles/projects.css";
import Link from "next/link";
import Image from "next/image";

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
      <Image
        alt={title}
        src={`/myProjects/${image}`}
        loading="lazy"
        height={400}
        width={400}
        className="w-full h-full object-cover"
      />
      <div className="card__content p-4 flex flex-col justify-between">
        <div>
          <p className="text-xl font-bold mb-2 text-gray-800">{title}</p>
          <p className="text-sm mb-2 text-gray-600">{description}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Key Features:
          </h3>
          <ul className="space-y-2 mb-4">
            {keyFeatures?.map((feature) => (
              <li
                key={feature.id}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="flex-shrink-0 w-2 h-2 mt-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></span>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            {gitUrl && (
              <Link
                href={gitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 transition-colors text-white font-semibold text-sm shadow-md"
              >
                GitHub
              </Link>
            )}
            {liveUrl && (
              <Link
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-colors text-white font-semibold text-sm shadow-md"
              >
                Live Demo
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
