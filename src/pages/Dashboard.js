// /src-jsx/pages/Dashboard.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";
import DashboardHeader from "./dashboard/DashboardHeader";
import StatsGrid from "./dashboard/StatsGrid";
import NotificationsTable from "./all-notifications/components/NotificationsTable";
import PerformanceChart from "./dashboard/PerformanceChart";
const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    apiFetch({
      path: "/surftrust/v1/analytics"
    }).then(data => setAnalyticsData(data)).catch(error => console.error("Error fetching dashboard analytics:", error)).finally(() => setIsLoading(false));
  }, []);

  // In /src-jsx/pages/Dashboard.js -> return statement

  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-dashboard-layout"
  }, /*#__PURE__*/React.createElement(DashboardHeader, null), isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "surftrust-loading-container"
  }, /*#__PURE__*/React.createElement(Spinner, null)) : analyticsData ?
  /*#__PURE__*/
  // --- THIS IS THE FIX ---
  // The Fragment now correctly wraps both sibling elements.
  // The invalid <p> tag has been removed.
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    className: "surftrust-section-header"
  }, "Lifetime Performance"), /*#__PURE__*/React.createElement(StatsGrid, {
    stats: analyticsData.totals
  })) : /*#__PURE__*/React.createElement("p", null, "Could not load lifetime stats."), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-dashboard-main-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "surftrust-dashboard-chart-wrapper"
  }, isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "surftrust-loading-container"
  }, /*#__PURE__*/React.createElement(Spinner, null)) : analyticsData ? /*#__PURE__*/React.createElement(PerformanceChart, {
    chartData: analyticsData.chart
  }) : /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("p", null, "Could not load chart data."))), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-dashboard-recent-notifications"
  }, /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel-header"
  }, /*#__PURE__*/React.createElement("h2", null, "Recent Notifications"), /*#__PURE__*/React.createElement(Link, {
    to: "/all-notifications",
    className: "button is-secondary is-small"
  }, "View All")), isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "surftrust-loading-container",
    style: {
      minHeight: "250px"
    }
  }, /*#__PURE__*/React.createElement(Spinner, null)) : /*#__PURE__*/React.createElement(NotificationsTable, {
    mode: "recent",
    limit: 10
  }) // Also updated this to 10 as requested
  ))));
};
export default Dashboard;