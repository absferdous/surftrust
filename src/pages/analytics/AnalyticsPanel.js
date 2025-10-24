// /src-jsx/pages/analytics/AnalyticsPanel.js

import React, { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";
import StatCard from "../../shared/components/StatCard";
// Assuming the new chart component is in the dashboard components folder
import PerformanceChart from "../dashboard/PerformanceChart";
const AnalyticsPanel = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    apiFetch({
      path: "/surftrust/v1/analytics"
    }).then(data => setAnalyticsData(data)).catch(error => console.error("Error fetching analytics:", error)).finally(() => setIsLoading(false));
  }, []);
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-loading-container"
    }, /*#__PURE__*/React.createElement(Spinner, null));
  }
  if (!analyticsData) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-panel"
    }, "Could not load analytics data.");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-analytics-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "surftrust-stats-grid"
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "dashicons-visibility",
    value: analyticsData.totals.views,
    label: "Total Views"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "dashicons-pointer",
    value: analyticsData.totals.clicks,
    label: "Total Clicks"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "dashicons-chart-pie",
    value: `${analyticsData.totals.ctr}%`,
    label: "Click-Through Rate"
  })), /*#__PURE__*/React.createElement(PerformanceChart, {
    chartData: analyticsData.chart
  }));
};
export default AnalyticsPanel;