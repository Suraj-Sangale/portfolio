import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [transitionState, setTransitionState] = useState({
    active: false,
    expanding: false,
    type: "to-light",
    x: 0,
    y: 0
  });

  useEffect(() => {
    // Read from localStorage on mount
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    
    // Find toggle button coordinates dynamically
    const toggleEl = document.getElementById("theme-toggle");
    let x = window.innerWidth * 0.92;
    let y = 40;
    if (toggleEl) {
      const rect = toggleEl.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    // Trigger transition overlay
    setTransitionState({
      active: true,
      expanding: false,
      type: nextTheme === "light" ? "to-light" : "to-dark",
      x,
      y
    });

    // Step 1: Trigger the expanding clip-path
    setTimeout(() => {
      setTransitionState(prev => ({ ...prev, expanding: true }));
    }, 20);

    // Step 2: Switch the actual page theme in the middle of transition
    setTimeout(() => {
      setTheme(nextTheme);
      localStorage.setItem("theme", nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.classList.add("light-mode");
      } else {
        document.documentElement.classList.remove("light-mode");
      }
    }, 350);

    // Step 3: Stop expanding, start fading out the overlay
    setTimeout(() => {
      setTransitionState(prev => ({ ...prev, expanding: false }));
    }, 850);

    // Step 4: End transition completely
    setTimeout(() => {
      setTransitionState(prev => ({ ...prev, active: false }));
    }, 1250);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      {transitionState.active && (
        <div
          className={`theme-transition-overlay ${transitionState.type} ${
            transitionState.expanding ? "expanding" : "fading"
          }`}
          style={{
            "--toggle-x": `${transitionState.x}px`,
            "--toggle-y": `${transitionState.y}px`
          }}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
