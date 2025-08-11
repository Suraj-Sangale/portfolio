"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutMeText, images, resumeLink } from "../utilities/Data";
import ResumeModal from "./Items/ResumeModal";
import CustomTitle from "./Items/CustomTitle";
import GitHubGraph from "./Items/gitHubGraph";
import Image from "next/image";
import { useRouter } from "next/router";
import aboutStyles from "../styles/about.module.css";

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  gsap.registerPlugin(ScrollTrigger);

  const router = useRouter();
  const containerRef = useRef(null);

  // Handle ?view_resume query param
  useEffect(() => {
    if (router.query.view_resume) {
      setIsModalOpen(true);
    }
  }, [router.query]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".icon-box", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);
  // Clean query param without reload
  const removeQuery = () => {
    router.replace(router.pathname, undefined, { shallow: true });
  };

  return (
    <section
      id="about"
      className="about container section relative"
    >
      <CustomTitle
        subheading="About"
        mainText="What I"
        highlightedText="Do"
      />

      <div className="mx-auto my-8 md:p-8 p-4 bg-gray-200 rounded-lg shadow-md w-96 md:w-10/12">
        {/* About text */}
        <div className="mb-6">
          <p className="about__description">{aboutMeText}</p>
          <h2 className="section__subtitle text-slate-800 text-center">
            Skills
          </h2>
        </div>

        {/* Skill icons */}
        <div
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {images.map((item, index) => (
            <div
              key={index}
              className="icon-box relative overflow-hidden flex flex-col justify-center items-center h-22 m-0 rounded-md transform transition-transform duration-300 hover:scale-110 cursor-pointer"
            >
              <Image
                src={item.imgUrl}
                alt={item.name}
                className="max-w-full object-cover"
                style={{ maxHeight: "72%", maxWidth: "100%" }}
                width={65}
                height={65}
                loading="lazy"
              />
              <p className="mb-1 text-center text-sm">{item.name}</p>
            </div>
          ))}
        </div>

        {/* GitHub Contributions */}
        <GitHubGraph />

        {/* Resume button */}
        <div>
          <button
            className={`mt-4 text-center ${aboutStyles.styleButton}`}
            onClick={() => setIsModalOpen(true)}
          >
            <span className={aboutStyles.viewResumeButton}>View Resume</span>
          </button>

          {/* Modal */}
          <ResumeModal
            show={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              removeQuery();
            }}
            resumeLink={resumeLink}
          />
        </div>
      </div>
    </section>
  );
};

export default About;
