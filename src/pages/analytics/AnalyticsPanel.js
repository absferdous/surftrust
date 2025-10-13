// /src-jsx/components/AnalyticsPanel.js

import React, { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import StatCard from "../../shared/components/StatCard";
Chart.register(...registerables); // Required for Chart.js v3+

// A reusable component for the stat cards

const AnalyticsPanel = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);

    // Manually create the apiFetch request with the nonce header
    const fetchRequest = {
      path: "/surftrust/v1/analytics",
      method: "GET",
      headers: {
        // Read the nonce from the global object we created in PHP
        "X-WP-Nonce": window.surftrust_admin_data.nonce
      }
    };
    apiFetch(fetchRequest).then(data => {
      setStats(data);
    }).catch(error => {
      console.error("Error fetching analytics:", error.message, error.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-panel"
    }, "Loading Analytics...");
  }
  if (!stats) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-panel"
    }, "Could not load analytics data. Please check the browser console for errors.");
  }

  // Chart.js configuration
  const chartData = {
    labels: stats.chart.labels,
    datasets: [{
      label: "Views",
      data: stats.chart.views,
      borderColor: "#6c5ce7",
      backgroundColor: "rgba(108, 92, 231, 0.2)",
      fill: true,
      tension: 0.4
    }]
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f5f5f5",
      padding: "20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      marginBottom: "30px"
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "dashicons-visibility",
    value: stats.totals.views,
    label: "Total Views"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "dashicons-pointer",
    value: stats.totals.clicks,
    label: "Total Clicks"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "dashicons-chart-pie",
    value: `${stats.totals.ctr}%`,
    label: "Click-Through Rate"
  })), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("h3", null, "Last 7 Days Activity"), /*#__PURE__*/React.createElement(Line, {
    options: chartOptions,
    data: chartData
  })));
};
export default AnalyticsPanel;