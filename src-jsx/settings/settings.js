// /src/index.js
import React from "react";
import { render } from "@wordpress/element";
import App from "./App";

document.addEventListener("DOMContentLoaded", () => {
  const targetDiv = document.getElementById("surftrust-settings-app");
  if (targetDiv) {
    render(<App />, targetDiv);
  }
});
