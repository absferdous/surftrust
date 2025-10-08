// /src-jsx/dashboard/dashboard.js - DEBUGGING VERSION

import React from "react";
import { render } from "@wordpress/element";
import DashboardHeader from "./DashboardHeader";
import StatsGrid from "./StatsGrid";
const DashboardApp = () => {
  console.log("Surftrust Dashboard LOG: DashboardApp component is rendering.");
  return (
    <div>
      <DashboardHeader />
      <StatsGrid />
    </div>
  );
};

// --- THIS IS THE CRITICAL PART ---

console.log(
  "Surftrust Dashboard LOG: dashboard.js file has been loaded and parsed."
);

const initDashboard = () => {
  console.log(
    "Surftrust Dashboard LOG: initDashboard function has been called."
  );

  const targetDiv = document.getElementById("surftrust-dashboard-app");

  if (targetDiv) {
    console.log(
      "Surftrust Dashboard LOG: SUCCESS - Found the target div. Rendering React app."
    );
    render(<DashboardApp />, targetDiv);
  } else {
    console.error(
      "Surftrust Dashboard LOG: FAILURE - Could not find the target div with ID 'surftrust-dashboard-app'."
    );
  }
};

// Instead of DOMContentLoaded, we will use the more reliable window.onload,
// which waits for EVERYTHING (including images and stylesheets) to load.
// This is a more robust way to ensure the DOM is ready.
window.addEventListener("load", initDashboard);
