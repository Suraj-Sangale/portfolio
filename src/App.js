// src/App.js
import React from 'react';
import './App.css';
import { animateScroll as scroll } from 'react-scroll';

import Home from './components/Home';
import About from './components/About';
import Work from './components/Work';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import CustomCursor from './components/Items/CustomCursor';

function App() {
  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  return (
    <div className="App">
      <CustomCursor />
      <Navbar />
      <Home scrollToTop={scrollToTop} />
      <About />
      <Work />
      <Contact />
    </div>
  );
}

export default App;
