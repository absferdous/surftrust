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
      headers: { "X-WP-Nonce": window.surftrust_admin_data.nonce },
    };
    apiFetch(fetchRequest)
      .then((data) => setStats(data.totals))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div
        className="surftrust-loading-container"
        style={{ minHeight: "150px" }}
      >
        <Spinner />
      </div>
    );
  }

  if (!stats) {
    return <p>Could not load analytics stats.</p>;
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
