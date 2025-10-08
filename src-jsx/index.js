// /src-jsx/index.js
import React from "react";
import { render } from "@wordpress/element";
import App from "./App";

// Find the root div we created in our PHP
const appRoot = document.getElementById("surftrust-app-root");

if (appRoot) {
  render(<App />, appRoot);
}
