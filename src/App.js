// src/App.js
import React from 'react';
import './App.css';
import { Link, animateScroll as scroll } from 'react-scroll';

import Home from './components/Home';
import About from './components/About';
import Work from './components/Work';
import Contact from './components/Contact';
import Navbar from './components/Navbar';

function App() {
  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  return (
    <div className="App">
      <Navbar />
      <Home scrollToTop={scrollToTop} />
      <About />
      <Work />
      <Contact />
    </div>
  );
}

export default App;
