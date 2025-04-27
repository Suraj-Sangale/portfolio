import React from "react";
import { useEffect, useState } from "react";
import { FaEye, FaGithub } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa"; // For feature icon

export default function ProjectCard({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on the body
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling on the body
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      {/* Card */}
      <div
        className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-5"
        onClick={() => setIsOpen(true)}
      >
        {/* Image */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={`/myProjects/${project.image}`}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <div className="flex space-x-3">
              <FaEye className="text-gray-600 hover:text-black text-xl" />
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-gray-600 hover:text-black text-xl" />
              </a>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-black text-white text-xs rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden relative flex flex-col md:flex-row">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
            >
              ✕
            </button>

            {/* Left side: Image */}
            <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center relative">
              <img
                src={`/myProjects/${project.image}`}
                alt="Project Preview"
                className="object-contain w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white text-center text-lg font-semibold">
                Project Preview
              </div>
            </div>

            {/* Right side: Details */}
            <div className="w-full md:w-1/2 p-8 overflow-y-scroll scrollbar-hide max-h-[80vh]">
              <h2 className="text-2xl font-bold mb-4">{project.title}</h2>

              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 text-sm mb-6">
                {project.description}
              </p>

              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <ul className="space-y-3">
                {project.keyFeatures.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex items-start space-x-2 bg-blue-50 rounded-lg p-3"
                  >
                    <FaCheckCircle className="text-blue-600 mt-1" />
                    <span className="text-gray-700 text-sm">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mt-6 mb-2">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-black text-white text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
