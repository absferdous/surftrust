// /src-jsx/pages/Dashboard.js
import React from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import StatsGrid from "./dashboard/StatsGrid";

const Dashboard = () => {
  return (
    <div>
      <DashboardHeader />
      <StatsGrid />
      {/* We can add more components like "What's New" here later */}
    </div>
  );
};

export default Dashboard;
