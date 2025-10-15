// /src-jsx/index.js
import React from "react";
import { render } from "@wordpress/element";
import App from "./App";

// Find the root div we created in our PHP
console.log("[SurfPop Debug] React entry file (index.js) is running.");
const appRoot = document.getElementById("surftrust-app-root");
if (appRoot) {
  // --- ADD THIS LOGGING LINE ---
  console.log("[SurfPop Debug] Found the root div. Rendering <App /> component.");
  render(/*#__PURE__*/React.createElement(App, null), appRoot);
} else {
  // --- ADD THIS LOGGING LINE ---
  console.error("[SurfPop Debug] CRITICAL: Did not find the root div #surftrust-app-root.");
}