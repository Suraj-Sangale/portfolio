import React from "react";
import "./App.css";
import { animateScroll as scroll } from "react-scroll";

import Home from "./components/Home";
import About from "./components/About";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/Items/CustomCursor";
import Timeline from "./components/Timeline";
import Projects from "./components/Projects";

function App() {
  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  return (
    <div
      className="App"
      style={{ backgroundColor: "" }}
    >
      <div className="bg-animation">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div id="stars4"></div>
      </div>
      <CustomCursor />
      <Navbar />
      <Home scrollToTop={scrollToTop} />
      <About />
      <Timeline />
      <Projects />
      {/* <Work /> */}
      <Contact />
    </div>
  );
}

export default App;
