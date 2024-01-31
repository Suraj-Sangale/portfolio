// Config Driven UI
import { PiGraduationCapDuotone, PiBriefcaseLight } from "react-icons/pi";



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