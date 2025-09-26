// /src-jsx/dashboard/dashboard.js - DEBUGGING VERSION

import React from "react";
import { render } from "@wordpress/element";
import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
const DashboardApp = () => {
  console.log("Surftrust Dashboard LOG: DashboardApp component is rendering.");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DashboardHeader, null), /*#__PURE__*/React.createElement(StatsGrid, null));
};

// --- THIS IS THE CRITICAL PART ---

console.log("Surftrust Dashboard LOG: dashboard.js file has been loaded and parsed.");
const initDashboard = () => {
  console.log("Surftrust Dashboard LOG: initDashboard function has been called.");
  const targetDiv = document.getElementById("surftrust-dashboard-app");
  if (targetDiv) {
    console.log("Surftrust Dashboard LOG: SUCCESS - Found the target div. Rendering React app.");
    render(/*#__PURE__*/React.createElement(DashboardApp, null), targetDiv);
  } else {
    console.error("Surftrust Dashboard LOG: FAILURE - Could not find the target div with ID 'surftrust-dashboard-app'.");
  }
};

// Instead of DOMContentLoaded, we will use the more reliable window.onload,
// which waits for EVERYTHING (including images and stylesheets) to load.
// This is a more robust way to ensure the DOM is ready.
window.addEventListener("load", initDashboard);