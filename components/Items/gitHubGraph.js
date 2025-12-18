import moment from "moment";
import { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";

export default function GitHubGraph() {
  const [sizeConfig, setSizeConfig] = useState({
    blockSize: 14,
    blockMargin: 4,
    fontSize: 16,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        // Small screens
        setSizeConfig({ blockSize: 10, blockMargin: 2, fontSize: 12 });
      } else if (width < 1024) {
        // Medium screens
        setSizeConfig({ blockSize: 9, blockMargin: 3, fontSize: 14 });
      } else {
        // Large screens
        setSizeConfig({ blockSize: 12, blockMargin: 4, fontSize: 16 });
      }
    };

    handleResize(); // run on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <h2 className=" section__subtitle  text-slate-800 mb-4  mt-8 text-center">
        GitHub Contributions
      </h2>
      <div className="overflow-x-auto max-w-full custom-scrollbar">
        <div className="w-full flex justify-center">
          <GitHubCalendar
            username="Suraj-Sangale"
            blockSize={sizeConfig.blockSize}
            blockMargin={sizeConfig.blockMargin}
            fontSize={sizeConfig.fontSize}
            colorScheme="light"
            transformData={(data) =>
              data.filter((day) => moment(day.date).isSameOrAfter("2025-01-01"))
            }
          />
        </div>
      </div>
    </>
  );
}
