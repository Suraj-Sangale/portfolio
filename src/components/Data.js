// Config Driven UI
import { PiGraduationCapDuotone, PiBriefcaseLight } from "react-icons/pi";

export const images = [
    { id: '02', name: 'JavaScript', imgUrl: 'https://i.ibb.co/Lhq2sJf/js.png' },
    { id: '01', name: 'Next.js', imgUrl: 'https://i.ibb.co/h7xbhPv/nextjs.jpg' },
    { id: '01', name: 'React', imgUrl: 'https://i.ibb.co/Ss4z8Z0/reactpng.png' },
    { id: '05', name: 'Mongo DB', imgUrl: 'https://i.ibb.co/9qCJLZV/mongo.png' },
    { id: '04', name: 'Node.js', imgUrl: 'https://i.ibb.co/vYqSP95/pngwing-com-2.png' },
    { id: '06', name: 'strapi', imgUrl: 'https://i.ibb.co/2Zk80Vx/strapi.png' },
    { id: '07', name: 'Redis', imgUrl: 'https://i.ibb.co/47qry58/redis.webp' },
    { id: '06', name: 'Tailwind CSS', imgUrl: 'https://i.ibb.co/pWXXdGj/twd.png' },
    { id: '07', name: 'Material UI', imgUrl: 'https://i.ibb.co/ydQfq96/mui.png' },
    // { id: '08', name: 'Bootstrap', imgUrl: 'https://i.ibb.co/9ct0WTx/bootstrap.png' },
    
]
export const aboutMeText = 'I thrive in environments where creativity and innovation are valued, constantly seeking out new ways to approach problems and deliver impactful solutions. My goal is simple to leverage my skills, experience, and passion to make a meaningful impact in software development. I am a capable team player who can adjust to any difficult circumstance. I can operate effectively both independently and in a group setting.'

let graduation = <PiGraduationCapDuotone />;
let work = <PiBriefcaseLight />;

const Data = [

    {
        id: 3,
        category: "education",
        icon: graduation,
        year: "2017-2022",
        title: "B.E in EXTC",
        desc: "Mumbai University - 7.35 CGPA",
    },
    {
        id: 2,
        category: "education",
        icon: graduation,
        year: "2016-2017",
        title: "HSC",
        desc: "State Board - 56.31%",
    },
    {
        id: 4,
        category: "experience",
        icon: work,
        year: "07/2022 - 12/2023",
        title: "Boppo Technologies",
        desc: "Software Engineer",
    },
    {
        id: 5,
        category: "experience",
        icon: work,
        year: "01/2022 - 03/2022",
        title: "Intern at CGI",
        desc: "Front-End Developer",
    },
];
export default Data