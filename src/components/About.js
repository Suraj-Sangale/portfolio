import React from 'react';
import "./About.css"
import { aboutMeText, images } from './Data';
const About = () => {
  return (
    <div className='about container section' id='about'><h2 className='section__title text-white'>
      About Me
    </h2>
      <div className=" mx-auto my-8 p-8 bg-white rounded-lg shadow-md w-10/12		">
        <div className="mb-6">
          <p className='about__description'>
            {aboutMeText}</p>
          <h2 className='section__subtitle text-slate-800 '>Skills</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden group flex justify-center items-center h-20 m-3 rounded-md transition-transform transform hover:scale-105"
            >
              <img
                src={item.imgUrl}
                alt={`Image ${item.id}`}
                className="max-h-full max-w-full transition-transform transform duration-300 group-hover:scale-105"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About;
