import React from "react";
import Header from "./header";

export default function Layout({ children }) {
  return (
    <>
      <div className="bg-animation">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div id="stars4"></div>
      </div>
      <Header />
      {children}
    </>
  );
}

