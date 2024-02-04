// Config Driven UI
import { PiGraduationCapDuotone, PiBriefcaseLight } from "react-icons/pi";

export const images = [
    { id: '01', name: 'React', imgUrl: 'https://i.ibb.co/Ss4z8Z0/reactpng.png' },
    { id: '02', name: 'JavaScript', imgUrl: 'https://i.ibb.co/Lhq2sJf/js.png' },
    { id: '03', name: 'Redux', imgUrl: 'https://i.ibb.co/YXZYK05/redux.png' },
    { id: '04', name: 'Node.js', imgUrl: 'https://i.ibb.co/vYqSP95/pngwing-com-2.png' },
    { id: '05', name: 'Mongo DB', imgUrl: 'https://i.ibb.co/9qCJLZV/mongo.png' },
    { id: '06', name: 'Tailwind CSS', imgUrl: 'https://i.ibb.co/pWXXdGj/twd.png' },
    { id: '07', name: 'Material UI', imgUrl: 'https://i.ibb.co/ydQfq96/mui.png' },
    { id: '08', name: 'Bootstrap', imgUrl: 'https://i.ibb.co/9ct0WTx/bootstrap.png' },

]
export const aboutMeText = 'I am an enthusiastic, reliable, responsible and hard working person. I am a capable team player who can adjust to any difficult circumstance. I can operate effectively both independently and in a group setting.I am an enthusiastic, reliable, responsible and hard working person. I am a capable team player who can adjust to any difficult circumstance. I can operate effectively both independently and in a group setting.'

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