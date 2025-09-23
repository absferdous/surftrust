// /src-jsx/dashboard/dashboard.js
import React from "react";
import { render } from "@wordpress/element";
const DashboardApp = () => {
  return /*#__PURE__*/React.createElement("h1", null, "Surftrust Dashboard");
};
document.addEventListener("DOMContentLoaded", () => {
  const targetDiv = document.getElementById("surftrust-dashboard-app");
  if (targetDiv) {
    render(/*#__PURE__*/React.createElement(DashboardApp, null), targetDiv);
  }
});