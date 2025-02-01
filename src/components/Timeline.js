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
import { BsFillHexagonFill } from "react-icons/bs";
import ExperienceCard from "./Items/ExperienceCard";
import { EXPERIENCEDATA } from "./Data";

const Timeline = () => {
  return (
    <div className="flex justify-center items-center min-h-screen card-container">
      <h1 className="text-4xl font-bold mb-3 text-white">My Journey</h1>
      <p className="text-lg text-white">
        For more information, have a look at my
        <a
          className="text-blue-500 underline hover:text-blue-700 ml-1"
          target="_blank"
          rel="noreferrer"
        >
          curriculum vitae
        </a>
        .
      </p>
      <div className="w-96 md:w-[65rem] h-auto relative">
        <ul className="relative flex flex-col items-center space-y-8">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-white border-l-2 border-gray-300"></div>
          {/* Dynamic list items */}
          {[...EXPERIENCEDATA].reverse().map((item, index) => (
            <li
              key={index}
              className={`relative text-gray-700 px-4 py-2 rounded-lg w-full md:w-[48%] text-center ${
                index % 2 === 0
                  ? "md:self-start md:ml-0"
                  : "md:self-end md:mr-0"
              }`}
            >
              <div
                className={`absolute hidden md:block ${
                  index % 2 === 0
                    ? "left-auto -right-[2rem]"
                    : "-left-[2rem] right-auto"
                }`}
              >
                <BsFillHexagonFill
                  color="red"
                  size={"25"}
                />
              </div>

              <ExperienceCard
                item={item}
                index={index}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
