import CustomSwiper from "@/utilities/customSwiper";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { SwiperSlide } from "swiper/react";
import { CiShare1 } from "react-icons/ci";
import { useRouter } from "next/router";
import { trackProjectView } from "@/utilities/analytics";
import CommonModal from "../common/commonModal";
import ProjectDetailModal from "./ProjectDetailModal";

export default function ProjectCard({ project, isDefaultOpen, filter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const router = useRouter();

  // ✅ Open modal if slug matches
  useEffect(() => {
    if (isDefaultOpen) {
      setIsOpen(true);
      // ── dataLayer event ─────────────────────────────────
      trackProjectView(project.title, project.slug, project.type);
    }
  }, [isDefaultOpen]);

  const isFilteredOut = filter !== "all" && filter !== project.type;

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

  const handleClose = () => {
    setIsOpen(false);

    // remove slug from URL
    router.replace({ pathname: router.pathname, query: {} }, undefined, {
      shallow: true,
    });
  };

  const { image = [] } = project || {};

  const ImageComponent = ({ img, alt }) => (
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
  );

  return (
    <>
      {/* Project Card */}
      <div
        className={`max-w-sm bg-gray-100 backdrop-blur-md rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:-translate-y-1 cursor-pointer ${isFilteredOut ? "grayscale brightness-75 scale-95 pointer-events-none" : ""}`}
        onClick={() => {
          setIsOpen(true);
          // ── dataLayer event ─────────────────────────────────
          trackProjectView(project.title, project.slug, project.type);
        }}
      >
        {/* Image Carousel */}
        {image && image.length > 0 && (
          <div
            className="relative w-full h-52 sm:h-56 overflow-hidden"
            onClick={handleSwiperClick}
          >
            {isFilteredOut ? (
              <ImageComponent
                img={image[0]}
                alt={project.title}
              />
            ) : (
              <CustomSwiper carouselOptions={carouselOptions}>
                {image.map((img, index) => (
                  <SwiperSlide key={index}>
                    <ImageComponent
                      img={img}
                      alt={project.title}
                    />
                  </SwiperSlide>
                ))}
              </CustomSwiper>
            )}
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

      {/* ── Bottom-sheet popup (same animation as Resume modal) ── */}
      <CommonModal
        modalOpen={isOpen}
        setModalOpen={setIsOpen}
        modalSize={"bg-black/40 backdrop-blur-lg"}
        isDarkMode
        bottomSheet
      >
        <ProjectDetailModal
          project={project}
          onClose={() => {
            setIsOpen(false);
            handleClose();
          }}
        />
      </CommonModal>
    </>
  );
}
