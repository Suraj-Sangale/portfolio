import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaGithub } from "react-icons/fa";
import { CiShare1 } from "react-icons/ci";
import CustomSwiper from "@/utilities/customSwiper";
import { SwiperSlide } from "swiper/react";

export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  const { image = [] } = project;

  const carouselOptions = {
    slidesPerView: 1,
    loop: true,
    speed: 1200,
    grabCursor: true,
    autoplay: { delay: 2500 },
    navigation: true,
    pagination: { type: "fraction", clickable: true },
    breakpoints: { 0: { slidesPerView: 1 } },
  };

  return (
    <div
      className="w-full flex flex-col md:flex-row"
      style={{
        minHeight: "60vh",
        maxHeight: "88vh",
        background: "#ffffff",
      }}
    >
      {/* ── Left: Image gallery ── */}
      {image.length > 0 && (
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative flex-shrink-0">
          <CustomSwiper carouselOptions={carouselOptions} className="w-full h-full">
            {image.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="w-full flex items-center justify-center bg-gray-200 h-72 md:h-full">
                  <Image
                    src={`/myProjects/${img}`}
                    alt={`${project.title} screenshot ${i + 1}`}
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
      )}

      {/* ── Right: Details ── */}
      <div
        className={`overflow-y-auto p-6 md:p-8 ${
          image.length > 0 ? "w-full md:w-1/2" : "w-full"
        }`}
        style={{ background: "#fff", color: "#111" }}
      >
        {/* Title + links */}
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-700 transition"
            >
              <CiShare1 className="text-xl" />
            </Link>
          )}
          {project.gitUrl && (
            <Link
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-700 transition"
            >
              <FaGithub className="text-lg" />
            </Link>
          )}
        </div>

        {/* Type badge */}
        {project.type && (
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-4"
            style={{
              background:
                project.type === "professional"
                  ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                  : "linear-gradient(135deg,#0ea5e9,#22d3ee)",
            }}
          >
            {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
          </span>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Key Features */}
        {project.keyFeatures?.length > 0 && (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Key Features
            </h3>
            <ul className="space-y-2 mb-6">
              {project.keyFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <FaCheckCircle className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{feature.text}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-white text-xs font-medium shadow-sm"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </>
        )}

        {/* CTA buttons */}
        <div className="flex gap-3 mt-8">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg text-sm font-medium text-white transition"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              Live Demo ↗
            </Link>
          )}
          {project.gitUrl && (
            <Link
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
            >
              GitHub
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
