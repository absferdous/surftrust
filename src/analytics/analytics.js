// /src-jsx/analytics/analytics.js
import React from "react";
import { render } from "@wordpress/element";
import AnalyticsPanel from "./AnalyticsPanel";
document.addEventListener("DOMContentLoaded", () => {
  const targetDiv = document.getElementById("surftrust-analytics-app");
  if (targetDiv) {
    render(/*#__PURE__*/React.createElement(AnalyticsPanel, null), targetDiv);
  }
});