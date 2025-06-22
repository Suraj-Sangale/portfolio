import React, { useEffect, useState } from "react";
import workStyles from "@/styles/work.module.css";

const ExperienceCard = ({ item, index }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return (
    <div className={workStyles.card}>
      <div
        className={`flex items-baseline justify-center ${
          isClient && index % 2 === 0 ? "md:justify-end" : "md:justify-start"
        }`}
      >
        <p className="text-blue-500 text-lg">{item?.title}</p>
        <div className="ml-3 text-sm">{item?.year}</div>
      </div>

      <h3 className={`${workStyles.cardTitle} my-3`}>{item?.desc}</h3>

      <div className={workStyles.skills}>
        {item.skills?.map((skill, i) => (
          <span
            className={workStyles.skill}
            key={i}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ExperienceCard;
