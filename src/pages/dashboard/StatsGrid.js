// /src-jsx/dashboard/components/StatsGrid.js
import React, { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";
import StatCard from "../../shared/components/StatCard";
const StatsGrid = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const fetchRequest = {
      path: "/surftrust/v1/analytics",
      headers: {
        "X-WP-Nonce": window.surftrust_admin_data.nonce
      }
    };
    apiFetch(fetchRequest).then(data => setStats(data.totals)).finally(() => setIsLoading(false));
  }, []);
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-loading-container",
      style: {
        minHeight: "150px"
      }
    }, /*#__PURE__*/React.createElement(Spinner, null));
  }
  if (!stats) {
    return /*#__PURE__*/React.createElement("p", null, "Could not load analytics stats.");
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