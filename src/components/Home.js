// src/components/Home.js
import React from 'react';
import "./Home.css";
import { FaLinkedin, FaGithub, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const Home = ({ scrollToTop }) => {
  const onClickIcons = (name) => {
    let url =
      name === 'linkdin' ? 'https://www.linkedin.com/in/suraj-sangale/'
        : name === 'git' ? 'https://github.com/Suraj-Sangale'
          : name === 'twitter' ? 'https://twitter.com/SurajSangale4'
            : name === 'fb' ? 'https://m.facebook.com/profile.php/?id=100009445972401'
              : 'https://www.instagram.com/____suraj____/'
    window.open(url, '_blank');
  }
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
            <a class="underline decoration-pink-500/30 text-white">I am a Software Developer</a>

          </div>
          <a href='#contact' className='btn mt-2'>Hire Me</a>
          {/* <div className="text-xl font-bold  text-white mt-8">You can find me on</div> */}
          <div className="flex  space-x-4 mt-4 socialIcons">
            <FaLinkedin className="contact__icon" onClick={() => onClickIcons('linkdin')} />
            <FaGithub className="contact__icon" onClick={() => onClickIcons('git')} />
            <FaTwitter className="contact__icon" onClick={() => onClickIcons('twitter')} />
            <FaFacebook className="contact__icon" onClick={() => onClickIcons('fb')} />
            <FaInstagram className="contact__icon" onClick={() => onClickIcons('insta')} />
          </div>
        </div>
      </section>
      {/* <button onClick={scrollToTop}>Scroll to Top</button> */}
    </div>
  );
};

export default Home;
