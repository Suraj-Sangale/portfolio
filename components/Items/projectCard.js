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

  const title =
    project.title ||
    [project.titleWord, project.titleRest].filter(Boolean).join(" ") ||
    "Project";

  const description = project.body || project.description || "";
  const imageList = project.images || project.image || [];
  const tagsList = project.tags || project.techStack || [];

  // ✅ Open modal if slug matches
  useEffect(() => {
    if (isDefaultOpen) {
      setIsOpen(true);
      // ── dataLayer event ─────────────────────────────────
      trackProjectView(title, project.slug, project.type);
    }
  }, [isDefaultOpen, title, project.slug, project.type]);

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

  const ImageComponent = ({ img, alt }) => (
    <div className="relative w-full h-full">
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={
          img?.startsWith("http") || img?.startsWith("/")
            ? img
            : `/myProjects/${img}`
        }
        alt={alt || title}
        className={`object-cover w-full h-full transition-all duration-500 ${
          imageLoading ? "opacity-0" : "opacity-100"
        }`}
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
        className={`max-w-sm bg-gray-100 backdrop-blur-md rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
          isFilteredOut
            ? "grayscale brightness-75 scale-95 pointer-events-none"
            : ""
        }`}
        onClick={() => {
          setIsOpen(true);
          // ── dataLayer event ─────────────────────────────────
          trackProjectView(title, project.slug, project.type);
        }}
      >
        <div>
          {/* Image Carousel */}
          {imageList && imageList.length > 0 && (
            <div
              className="relative w-full h-52 sm:h-56 overflow-hidden"
              onClick={handleSwiperClick}
            >
              {isFilteredOut ? (
                <ImageComponent img={imageList[0]} alt={title} />
              ) : (
                <CustomSwiper carouselOptions={carouselOptions}>
                  {imageList.map((img, index) => (
                    <SwiperSlide key={index}>
                      <ImageComponent img={img} alt={title} />
                    </SwiperSlide>
                  ))}
                </CustomSwiper>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="p-4 sm:p-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-1.5 flex-wrap">
                {/* {project.icon && <span>{project.icon}</span>} */}
                <span>{project.titleWord || project.title}</span>
                {project.titleRest && (
                  <span className="text-indigo-600">{project.titleRest}</span>
                )}
              </h2>
              <div className="flex space-x-3">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CiShare1 className="text-gray-700 hover:text-black text-xl" />
                  </Link>
                )}
                {project.gitUrl && (
                  <Link
                    href={project.gitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGithub className="text-gray-700 hover:text-black text-xl" />
                  </Link>
                )}
              </div>
            </div>

            {description && (
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-3">
                {description}
              </p>
            )}

            {/* Tech Stack / Tags */}
            {tagsList?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tagsList.map((tag, i) => {
                  const label = typeof tag === "string" ? tag : tag.label;
                  return (
                    <span
                      key={tag.id || label || i}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-xs font-medium shadow-sm hover:from-indigo-700 hover:to-purple-600 transition-colors"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
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
