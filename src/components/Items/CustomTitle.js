import React from "react";

const CustomTitle = ({ subheading = "", mainText, highlightedText }) => {
  return (
    <div className="text-container">
      {subheading && <p className="subheading">{subheading}</p>}
      <h1 className="main-heading">
        {mainText && <span className="white-text">{mainText} </span>}
        {highlightedText && (
          <span className="gradient-text">{highlightedText}</span>
        )}
      </h1>
    </div>
  );
};

export default CustomTitle;