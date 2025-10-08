// /src-jsx/analytics/analytics.js
import React from "react";
import { render } from "@wordpress/element";
import App from "./App"; // <-- Import the new App component

document.addEventListener("DOMContentLoaded", () => {
  const targetDiv = document.getElementById("surftrust-analytics-app");
  if (targetDiv) {
    // Render the main App component
    render(/*#__PURE__*/React.createElement(App, null), targetDiv);
  }
});