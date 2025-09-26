import React from "react";
import { render } from "@wordpress/element";
import App from "./App";
document.addEventListener("DOMContentLoaded", () => {
  // This ID must match the one we will create in our PHP meta box
  const targetDiv = document.getElementById("surftrust-builder-app");
  if (targetDiv) {
    render(/*#__PURE__*/React.createElement(App, null), targetDiv);
  }
});