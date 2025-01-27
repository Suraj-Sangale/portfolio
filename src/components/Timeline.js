// import React from "react";

// const Timeline = () => {
//   const cards = [
//     { id: 1, text: "This is the first card on the left." },
//     { id: 2, text: "This is the second card on the right." },
//     { id: 3, text: "This is the third card on the left." },
//   ];

//   return (
//     <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
//       {/* Vertical Blue Line */}
//       <div className="absolute bg-blue-500 w-1 h-full"></div>

//       {/* Cards */}
//       <div className="flex flex-col gap-12 lg:gap-16 w-full max-w-4xl px-4">
//         {cards.map((card, index) => (
//           <div
//             key={card.id}
//             className={`relative flex ${
//               index % 2 === 0 ? "justify-end" : "justify-start"
//             } items-center`}
//           >
//             {/* Card */}
//             <div className="bg-white border shadow-lg rounded-lg p-6 w-72 lg:w-96">
//               <p className="text-gray-700">{card.text}</p>
//             </div>

//             {/* Red Box */}
//             <div className="absolute bg-red-500 w-4 h-4 top-1/2 -translate-y-1/2"></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Timeline;

import React from "react";
import { PiGraduationCapDuotone, PiPaperPlaneFill } from "react-icons/pi";
import { BsFillHexagonFill } from "react-icons/bs";
import ExperienceCard from "./Items/ExperienceCard";
import { EXPERIENCEDATA } from "./Data";

const Timeline = () => {
  const hexagons = Array(5).fill(null); // Number of hexagons/cards
  const experiences = EXPERIENCEDATA;

  const skills = ["Angular", "AngularJS", "SpringBoot", "Java"];

  return (
    <div className="card-container flex justify-center items-center min-h-screen ">
      <div className=" shadow-lg rounded-2xl p-6 w-96 md:w-[32rem] h-auto relative my-10">
      <ul className="relative flex flex-col items-center space-y-8">
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-white border-l-2 border-gray-300"></div>
        {experiences.map((item, index) => (
          <li
            key={index}
            className="relative"
          >
            {/* Red hexagon */}
            {/* <div className="-ml-2">
              <BsFillHexagonFill
                color="red"
                size={"25"}
              />
            </div> */}
            {/* Cards */}
            <div
              className={`absolute ${
                index % 2 === 0 ? "left-[2.5rem]" : "right-[2.5rem]"
              } top-1/2`}
            >
              <ExperienceCard item={item} />
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Timeline;
