// /src-jsx/pages/dashboard/StatsGrid.js

import React from "react";
import StatCard from "../../shared/components/StatCard";

// The component now receives stats as a prop instead of fetching them itself.
const StatsGrid = ({ stats }) => {
  if (!stats) {
    return null; // Or a loading/error state if you prefer
  }

  return (
    <div className="surftrust-stats-grid">
      <StatCard
        icon="dashicons-visibility"
        value={stats.views}
        label="Total Views"
      />
      <StatCard
        icon="dashicons-pointer"
        value={stats.clicks}
        label="Total Clicks"
      />
      <StatCard
        icon="dashicons-chart-pie"
        value={`${stats.ctr}%`}
        label="Click-Through Rate"
      />
    </div>
  );
};

export default StatsGrid;
