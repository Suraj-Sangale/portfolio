import React from 'react';
import "./About.css"
const About = () => {
  return (
    <section className='about container section' id='about'>
      <h2 className='section__title text-white'>
        About Me
      </h2>

      <div className='about__container '>

        <div className='about__data '>
          <div className='about__info'>
            <p className='about__description'>
              I am an enthusiastic, reliable, responsible and hard working person. I am a capable team player who can adjust to any difficult circumstance. I can operate effectively both independently and in a group setting.I am an enthusiastic, reliable, responsible and hard working person. I am a capable team player who can adjust to any difficult circumstance. I can operate effectively both independently and in a group setting. </p>

            <h2 className='section__subtitle text-slate-800'>Skills</h2>
            <div className='skills grid grid-cols-4	gap-4 m-5 justify-center	'>
              <img src="https://i.ibb.co/Ss4z8Z0/reactpng.png" height={185} width={80} className='' />
              <img src="https://i.ibb.co/Lhq2sJf/js.png" alt="js" border="0" width={60} />
              <img src="https://i.ibb.co/YXZYK05/redux.png" alt="js" border="0" width={60} />
              <img src="https://i.ibb.co/vYqSP95/pngwing-com-2.png" alt="pngwing-com-2" border="0" width={130} />
              <img src="https://i.ibb.co/T06V7dV/mongo.png" alt="mongo" border="0" width={120} />
              <img src="https://i.ibb.co/HdCGSyp/pngwing-com-3.png" alt="pngwing-com-3" border="0" width={110} />
              <img src="https://i.ibb.co/8dSDYdc/mui.png" alt="mui" border="0" width={50} />
              <img src="https://i.ibb.co/Phwwy3n/bootstrap.png" alt="bootstrap" border="0" width={50} />
            </div>
            <a href='https://drive.google.com/file/d/1JI7tLvrBHkr6VCBcZJ2RlLq1q4l1_xPt/view?usp=sharing' className='btn' download={"Chetan's Resume"}>Download Resume</a>
          </div>

        </div>
      </div>


    </section>
  )
}

export default About;
