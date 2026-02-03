import CustomSwiper from "@/utilities/customSwiper";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { FaEye, FaGithub, FaCheckCircle } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { SwiperSlide } from "swiper/react";
// import projecStyle from "@/styles/projects.module.scss";
import { CiShare1 } from "react-icons/ci";

export default function ProjectCard({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // setImageLoading(true); // Reset loading state when modal opens
    } else {
      document.body.style.overflow = "auto";
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const carouselOptions = {
    slidesPerView: 1,
    loop: true,
    speed: 1500,
    grabCursor: true,
    autoplay: { delay: 2000 },
    navigation: true,
    pagination: {
      type: "fraction",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
    },
  };

  // Prevent modal opening on click of Swiper controls
  const handleSwiperClick = (e) => e.stopPropagation();

  return (
    <>
      {/* Project Card */}
      <div
        className="max-w-sm bg-gray-100 backdrop-blur-md rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:-translate-y-1 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {/* Image Carousel */}
        {project?.image && (
          <div
            className="relative w-full h-52 sm:h-56 overflow-hidden"
            onClick={handleSwiperClick}
          >
            <CustomSwiper carouselOptions={carouselOptions}>
              {(Array.isArray(project.image)
                ? project.image
                : [project.image]
              ).map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full">
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <Image
                      src={`/myProjects/${img}`}
                      alt={project.title}
                      className={`object-cover w-full h-full transition-all duration-500 ${
                        imageLoading ? "opacity-0" : "opacity-100"
                      }`}
                      // width={400}
                      // height={300}
                      loading="lazy"
                      fill
                      sizes="(max-width: 640px) 100vw, 400px"
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </CustomSwiper>
          </div>
        )}

        {/* Content Section */}
        <div className="p-4 sm:p-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <div className="flex space-x-3">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CiShare1 className="text-gray-700 hover:text-black text-xl" />
                </Link>
              )}
              {project.gitUrl && (
                <Link
                  href={project.gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="text-gray-700 hover:text-black text-xl" />
                </Link>
              )}
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-3">
            {project.description}
          </p>

          {/* Tech Stack */}
          {project.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-xs font-medium shadow-sm hover:from-indigo-700 hover:to-purple-600 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl bg-white/30 bg-opacity-50 z-40 p-4">
          <div
            ref={modalRef}
            className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <div className="absolute w-7 h-7 bg-gray-600 rounded-2xl top-4 right-4 text-gray-100 text-2xl md:top-6 md:right-6 z-50 flex items-center justify-center cursor-pointer">
              <button onClick={() => setIsOpen(false)}>
                <IoIosClose />
              </button>
            </div>

            {/* Left: Swiper Gallery */}
            {/* Left side: Swiper inside modal */}
            <div className="w-full md:w-1/2 bg-gray-200 flex flex-col items-center justify-center relative">
              {/* <div className="pointer-events-none absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/80 to-transparent text-white text-center text-lg font-semibold">
                Project Preview
              </div> */}
              <CustomSwiper
                key={isOpen ? `modal-swiper-open` : `modal-swiper-closed`}
                carouselOptions={carouselOptions}
                className="w-full"
              >
                {(Array.isArray(project.image)
                  ? project.image
                  : [project.image]
                ).map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full flex items-center justify-center bg-gray-200">
                      <Image
                        src={`/myProjects/${img}`}
                        alt="Project Preview"
                        className="object-contain w-full h-full"
                        loading="lazy"
                        width={1200}
                        height={800}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </CustomSwiper>
            </div>

            {/* Right: Project Details */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto modal-scrollbar">
              <div className="flex flex-row gap-x-2 items-center mb-4">
                <h2 className="text-2xl font-bold">{project.title}</h2>
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CiShare1 className="text-gray-700 hover:text-black text-xl" />
                  </Link>
                )}
              </div>

              <p className="text-gray-700 text-sm mb-6">
                {project.description}
              </p>

              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <ul className="space-y-2">
                {project.keyFeatures?.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex items-start gap-2 p-2 rounded hover:shadow-sm transition"
                  >
                    <FaCheckCircle className="text-blue-600 mt-1 w-5 h-5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {project.techStack?.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mt-6 mb-2">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold text-sm shadow-md"
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
