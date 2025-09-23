// /src-jsx/dashboard/dashboard.js
import React from "react";
import { render } from "@wordpress/element";

const DashboardApp = () => {
  return <h1>Surftrust Dashboard</h1>;
};

document.addEventListener("DOMContentLoaded", () => {
  const targetDiv = document.getElementById("surftrust-dashboard-app");
  if (targetDiv) {
    render(<DashboardApp />, targetDiv);
  }
});
