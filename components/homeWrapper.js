import React from "react";
import HomeLanding from "./homeLanding";
import About from "./about";
import Timeline from "./timeline";
import Projects from "./projects";
import ContactSection from "./contactSection";

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
      {/* <About /> */}
      {/* <Projects /> */}
      {/* <Timeline /> */}
      {/* <Contact /> */}
      {/* <ContactSection /> */}
    </>
  );
}
