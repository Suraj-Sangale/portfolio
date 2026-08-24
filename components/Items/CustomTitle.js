import React from "react";
import styles from "@/styles/header.module.scss";

const CustomTitle = ({
  subheading = "",
  mainText = "",
  highlightedText = "",
  className = ""
}) => {
  // checl
  return (
    <div className={styles.textContainer + "  ml-[4%] md:ml-0 " + className}>
      {subheading && <p className={styles.subheading}>{subheading}</p>}
      <h1 className={styles.mainHeading}>
        {mainText && <span className={styles.whiteText}>{mainText} </span>}
        {highlightedText && (
          <span className={styles.gradientText}>{highlightedText}</span>
        )}
      </h1>
    </div>
  );
};

export default CustomTitle;
