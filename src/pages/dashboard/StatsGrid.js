// /src-jsx/pages/dashboard/StatsGrid.js

import React from "react";
import StatCard from "../../shared/components/StatCard";

// The component now receives stats as a prop instead of fetching them itself.
const StatsGrid = ({
  stats
}) => {
  if (!stats) {
    return null; // Or a loading/error state if you prefer
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-stats-grid"
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "dashicons-visibility",
    value: stats.views,
    label: "Total Views"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "dashicons-pointer",
    value: stats.clicks,
    label: "Total Clicks"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "dashicons-chart-pie",
    value: `${stats.ctr}%`,
    label: "Click-Through Rate"
  }));
};
export default StatsGrid;