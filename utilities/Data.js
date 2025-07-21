import { PiGraduationCapDuotone, PiBriefcaseLight } from "react-icons/pi";
export const resumeLink =
  "https://drive.google.com/file/d/11-E0je2Un59hB-4QZrFqvOA3krCH9_tB/preview";
// "https://drive.google.com/file/d/13qMLjG5cUDb8c9ffsAYJon8v5VxU3wy6/preview";
// "https://drive.google.com/file/d/13qMLjG5cUDb8c9ffsAYJon8v5VxU3wy6/view?usp=sharing";
// sanple
export const images = [
  { id: "02", name: "JavaScript", imgUrl: "https://i.ibb.co/Lhq2sJf/js.png" },

  {
    id: "01",
    name: "Next.js",
    imgUrl:
      "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/nextjs-icon.png",
  },

  { id: "01", name: "React", imgUrl: "https://i.ibb.co/Ss4z8Z0/reactpng.png" },
  {
    id: "04",
    name: "Node.js",
    imgUrl: "https://i.ibb.co/p6YrRtk0/pngwing-com-1.png",
  },
  { id: "10", name: "MySQL", imgUrl: "https://i.ibb.co/XQK5wHP/mysql.png" },
  { id: "07", name: "Redis", imgUrl: "https://i.ibb.co/47qry58/redis.webp" },
  {
    id: "09",
    name: "TypeScript",
    imgUrl: "https://i.ibb.co/HLf7cS5p/type-Script.png",
  },
  {
    id: "11",
    name: "Socket IO",
    imgUrl: "https://i.ibb.co/ZRq8gdy8/socket-io.png",
  },
  { id: "05", name: "Mongo DB", imgUrl: "https://i.ibb.co/9qCJLZV/mongo.png" },
  { id: "06", name: "strapi", imgUrl: "https://i.ibb.co/cvbt3cN/strapi.png" },
  {
    id: "06",
    name: "Tailwind CSS",
    imgUrl: "https://i.ibb.co/pWXXdGj/twd.png",
  },
  { id: "07", name: "Material UI", imgUrl: "https://i.ibb.co/ydQfq96/mui.png" },
  // {
  //   id: "08",
  //   name: "Redux",
  //   imgUrl: "https://i.ibb.co/S7xRXwXf/redux.png",
  // },
  // { id: '08', name: 'Bootstrap', imgUrl: 'https://:.ibb.co/9ct0WTx/bootstrap.png' },
];
export const aboutMeText =
  "I thrive in environments where creativity and innovation are valued, constantly seeking out new ways to approach problems and deliver impactful solutions. My goal is simple to leverage my skills, experience, and passion to make a meaningful impact in software development. I am a capable team player who can adjust to any difficult circumstance. I can operate effectively both independently and in a group setting.";

let graduation = <PiGraduationCapDuotone />;
let work = <PiBriefcaseLight />;

// experience  data

export const EXPERIENCEDATA = [
  {
    id: 2,
    category: "education",
    icon: graduation,
    year: "2016-2017",
    title: "HSC",
    desc: "State Board - 56.31%",
  },
  {
    id: 3,
    category: "education",
    icon: graduation,
    year: "2017-2022",
    title: "B.E in EXTC",
    desc: "Mumbai University - 7.35 CGPA",
  },
  {
    id: 5,
    category: "experience",
    icon: work,
    year: "01/2022 - 03/2022",
    title: "Intern at CGI",
    desc: "Front-End Developer",
    skills: ["HTML", "CSS", "JavaScript", "React", "React router"],
  },
  {
    id: 6,
    category: "experience",
    icon: work,
    year: "07/2022 - 12/2023",
    title: "Boppo Technologies",
    desc: "Software Engineer",
    skills: ["React", "Redux", "React Native", "Python", "Java"],
  },
  {
    id: 4,
    category: "experience",
    icon: work,
    year: "02/2024 - present",
    title: "Fortune4 Technologies",
    desc: "Software Developer",
    skills: ["Next js", "Node js", "MySQL", "Redis", "Strapi"],
  },
];

export const SEOData = {
  title:
    "Suraj Sangale | Full Stack Developer | React | Next.js | Node.js Developer",
  description:
    "Hi, I'm Suraj — a full stack developer who crafts seamless user experiences and robust backends using modern technologies like React, Node.js, and Next.js. Let’s build the future together",
  canonical: "https://surajsangale.vercel.app",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://surajsangale.vercel.app",
    site_name: "Suraj Sangale Portfolio",
    title: "Suraj Sangale | Full Stack Developer",
    description:
      "Hi, I'm Suraj — a full stack developer who crafts seamless user experiences and robust backends using modern technologies like React, Node.js, and Next.js. Let’s build the future together.",
    images: [
      {
        url: "https://surajsangale.vercel.app/seoLogo.png",
        width: 1200,
        height: 630,
        alt: "Suraj Sangale Portfolio Preview",
      },
    ],
  },
  twitter: {
    handle: "@SurajSangale4",
    site: "@SurajSangale4",
    cardType: "summary_large_image",
  },
};
