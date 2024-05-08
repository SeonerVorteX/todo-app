"use client";

import { useState, useEffect } from "react";

export default () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div className="theme">
      <div className="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? (
          <i className="fa-solid fa-moon"></i>
        ) : (
          <i className="fa-solid fa-sun"></i>
        )}
      </div>
    </div>
  );
};
