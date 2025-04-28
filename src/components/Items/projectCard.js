import React, { useEffect, useState, useRef } from "react";
import { FaEye, FaGithub, FaCheckCircle } from "react-icons/fa";

export default function ProjectCard({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Card */}
      <div
        className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-4 cursor-pointer hover:shadow-2xl transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        {/* Image */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={`/myProjects/${project.image}`}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <div className="flex space-x-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaEye className="text-gray-600 hover:text-black text-xl" />
                </a>
              )}
              {project.gitUrl && (
                <a
                  href={project.gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="text-gray-600 hover:text-black text-xl" />
                </a>
              )}
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
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 transition-colors text-white font-semibold text-sm shadow-md"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close button */}
            <div className="absolute w-7 h-7 bg-gray-600 rounded-2xl top-4 right-4 text-gray-100 text-2xl md:top-6 md:right-6 z-50 flex items-center justify-center cursor-pointer">
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

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
            <div className="w-full md:w-1/2 p-6 overflow-y-auto scrollbar-hide">
              <h2 className="text-2xl font-bold mb-4">{project.title}</h2>

              {/* <h3 className="text-lg font-semibold mb-2">Description</h3> */}
              <p className="text-gray-700 text-sm mb-6">
                {project.description}
              </p>

              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <ul className="space-y-3">
                {project.keyFeatures.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex items-start space-x-2 rounded-lg p-3"
                  >
                    <FaCheckCircle className="text-blue-600 mt-1 w-5" />
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
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 transition-colors text-white font-semibold text-sm shadow-md"
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
