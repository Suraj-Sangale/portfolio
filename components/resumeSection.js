import { useState, useEffect, useContext } from "react";
// import Typewriter from "typewriter-effect";
import { FaFilePdf } from "react-icons/fa";
import { FiX, FiDownload, FiExternalLink, FiMoon, FiSun } from "react-icons/fi";
// import { ThemeContext } from "../../contexts/ThemeProvider";

const Button = ({
  onClick,
  children,
  className = "",
  disabled = false,
  icon: Icon,
  href,
  target,
  rel,
  as,
  download,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
    if (!disabled && href) {
      if (target === "_blank") {
        window.open(href, "_blank", rel ? rel : "noreferrer");
      } else {
        window.location.href = href;
      }
    }
  };

  const ButtonContent = () => (
    <>
      {Icon && <Icon size={16} />}
      <span className="font-bold">{children}</span>
    </>
  );

  // Anchor button
  if (as === "a" && href) {
    return (
      <div className={`flex ${className}`}>
        <a
          href={href}
          download={download}
          className={`relative cursor-pointer transition-all duration-300 ${
            disabled ? "cursor-not-allowed opacity-75" : ""
          }`}
          onClick={onClick}
          target={target}
          rel={rel}
        >
          <div
            className={`relative rounded-sm px-8 py-2.5 flex gap-2.5 items-center justify-center 
            bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 top-0 left-0 
            transition-[top_left] 
            ${
              disabled
                ? "hover:top-0 hover:left-0 active:top-0 active:left-0"
                : "hover:top-0.5 hover:left-0.5 active:top-1 active:left-1"
            }`}
          >
            <ButtonContent />
          </div>
          <div className="w-full h-full rounded-sm absolute top-1 left-1 border-2 border-neutral-900 dark:border-neutral-50" />
        </a>
      </div>
    );
  }

  // Default button
  return (
    <div className={`flex ${className}`}>
      <div
        className={`relative cursor-pointer transition-all duration-300 ${
          disabled ? "cursor-not-allowed opacity-75" : ""
        }`}
        onClick={handleClick}
      >
        <div
          className={`relative rounded-sm px-8 py-2.5 flex gap-2.5 items-center justify-center 
          bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 top-0 left-0 
          transition-[top_left] 
          ${
            disabled
              ? "hover:top-0 hover:left-0 active:top-0 active:left-0"
              : "hover:top-0.5 hover:left-0.5 active:top-1 active:left-1"
          }`}
        >
          <ButtonContent />
        </div>
        <div className="w-full h-full rounded-sm absolute top-1 left-1 border-2 border-neutral-900 dark:border-neutral-50" />
      </div>
    </div>
  );
};

const Ingredients = ({ socialLinks, terminalContent, resumeInfo }) => {
  const isDarkMode = false;
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showIngredientsModal) {
        setShowIngredientsModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIngredientsModal]);

  useEffect(() => {
    document.body.style.overflow = showIngredientsModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showIngredientsModal]);

  const handleDownloadResume = () => {
    const fileName = `Resume_${new Date()
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/,/g, "")
      .replace(/:/g, "")
      .replace(/ /g, "")}.pdf`;

    const link = document.createElement("a");
    link.href = resumeInfo.path;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`flex flex-col md:flex-row w-full max-w-6xl mx-auto text-gray-800 dark:text-white font-sans gap-8 ${
        isDarkMode ? "dark" : ""
      }`}
      data-theme={isDarkMode ? "dark" : "light"}
    >
      {/* Left side */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              {["bg-red-400", "bg-yellow-400", "bg-green-400"].map(
                (color, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 ${color} rounded-full`}
                  />
                )
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 ml-3 font-mono">
              terminal
            </div>
          </div>
          {/* Theme toggle */}
          <div
            className="relative cursor-pointer transition-all duration-300"
            // onClick={toggleTheme}
          >
            <div className="relative rounded-full p-2 flex items-center justify-center bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 top-0 left-0 transition-[top_left] hover:top-0.5 hover:left-0.5 active:top-1 active:left-1">
              {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </div>
            <div className="w-full h-full rounded-full absolute top-0.5 left-0.5 border-2 border-neutral-300 dark:border-neutral-600" />
          </div>
        </div>

        {/* Terminal Content */}
        {/* <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 shadow-inner border border-gray-200 dark:border-gray-700 font-mono text-sm">
          <Typewriter
            options={{ delay: terminalContent.delay, cursor: terminalContent.cursor }}
            onInit={(typewriter) => {
              terminalContent.content.forEach((item) => {
                if (item.type === "pause" && item.duration) {
                  typewriter.pauseFor(item.duration);
                } else if (item.type === "string" && item.value) {
                  typewriter.typeString(item.value);
                }
              });
              typewriter.start();
            }}
          />
        </div> */}

        {/* Social Links */}
        <div className="flex justify-start gap-6 mb-6">
          {socialLinks.map(({ icon: Icon, href, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:scale-110 transition-all duration-300"
              aria-label={label}
              style={{ color: isDarkMode ? "currentColor" : color }}
            >
              <Icon size={24} />
            </a>
          ))}
        </div>

        {/* Resume Button */}
        <Button
          icon={FaFilePdf}
          onClick={() => setShowIngredientsModal(true)}
          className="w-full"
        >
          View Resume
        </Button>
      </div>

      {/* Resume Modal */}
      {showIngredientsModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowIngredientsModal(false);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-hidden flex flex-col animate-fade-scale">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                Professional Profile
              </h2>
              <div
                className="relative cursor-pointer transition-all duration-300"
                onClick={() => setShowIngredientsModal(false)}
              >
                <div className="relative rounded-full p-2 flex items-center justify-center bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                  <FiX className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-hidden">
              <div className="h-full min-h-[400px] flex flex-col">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaFilePdf
                      className="text-red-500"
                      size={24}
                    />
                    <span className="font-medium text-gray-800 dark:text-white">
                      {resumeInfo.fileName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Updated: {resumeInfo.lastUpdated}
                  </span>
                </div>
                <iframe
                  src={resumeInfo.path}
                  width="100%"
                  height="100%"
                  className="flex-grow border-0 rounded-lg shadow-inner bg-white dark:bg-gray-900"
                  title="Resume"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button
                icon={FiDownload}
                onClick={handleDownloadResume}
                className="flex-1"
              >
                Download Resume
              </Button>
              <Button
                icon={FiExternalLink}
                href={resumeInfo.path}
                target="_blank"
                rel="noopener noreferrer"
                as="a"
                className="flex-1"
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ingredients;
