// src/components/Home.js
import React from 'react';
import "./Home.css";

const Home = ({ scrollToTop }) => {
  return (
    <div className='homeBg'>
      <h1 className='text-lime-500'></h1>
      <section className='home container' id='home'>
        <div className='intro flex flex-col	items-center	'>
          <div className='	'>
            <img src="https://i.ibb.co/kcLwjhh/person1.png" height={185} width={140} className='' />
          </div>
          <div>
            <h1 className='home__name text-white' >Hi, I am Suraj Sangale</h1>
            <a class="underline decoration-pink-500/30 text-white">I am a Full-Stack Developer</a>

          </div>
          <a href='#contact' className='btn'>Hire Me</a>
        </div>
      </section>
      {/* <button onClick={scrollToTop}>Scroll to Top</button> */}
    </div>
  );
};

export default Home;
