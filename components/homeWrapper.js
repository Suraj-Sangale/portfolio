import React from "react";
import HomeLanding from "./homeLanding";
import About from "./about";
import Timeline from "./timeline";
import Projects from "./projects";
import ContactSection from "./contactSection";
import ImageCarousel from "./imageCarousel";
import ScrollReveal from "./ScrollReveal";

export default function HomeWrapper({ pageData }) {
  return (
    <>
      {/* <div className="bg-animation">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div id="stars4"></div>
        </div> */}
      <HomeLanding pageData={pageData} />
      <ScrollReveal
        text={pageData?.about?.text || ""}
        accentWords={pageData?.about?.accentWords || []}
      />
      <ImageCarousel images={pageData?.about?.skills || []} />

      {/* <About /> */}
      {/* <Projects /> */}
      {/* <Timeline /> */}
      {/* <Contact /> */}
      {/* <ContactSection /> */}
    </>
  );
}
