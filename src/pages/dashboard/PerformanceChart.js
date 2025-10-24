// /src-jsx/pages/dashboard/components/PerformanceChart.js

import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
const PerformanceChart = ({
  chartData,
  title = "Last 7 Days Activity"
}) => {
  const data = {
    labels: chartData.labels,
    datasets: [{
      label: "Views",
      data: chartData.views,
      borderColor: "#6c5ce7",
      backgroundColor: "rgba(108, 92, 231, 0.2)",
      fill: true,
      tension: 0.4
    }, {
      label: "Clicks",
      data: chartData.clicks,
      borderColor: "#00a3ff",
      backgroundColor: "rgba(0, 163, 255, 0.2)",
      fill: true,
      tension: 0.4
    }]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        // Display labels for Views/Clicks
        position: "top",
        align: "end"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Only show whole numbers on the Y-axis
          precision: 0
        }
      }
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement(Line, {
    options: options,
    data: data
  }));
};
export default PerformanceChart;