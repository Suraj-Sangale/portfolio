import React from "react";
import HomeLanding from "./homeLanding";

export default function HomeWrapper() {
  return (
    <>
      <div className="bg-animation">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div id="stars4"></div>
      </div>
      <HomeLanding />
    </>
  );
}
