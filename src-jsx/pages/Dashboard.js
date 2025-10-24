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
    apiFetch({ path: "/surftrust/v1/analytics" })
      .then((data) => setAnalyticsData(data))
      .catch((error) =>
        console.error("Error fetching dashboard analytics:", error)
      )
      .finally(() => setIsLoading(false));
  }, []);

  // In /src-jsx/pages/Dashboard.js -> return statement

  return (
    <div className="surftrust-dashboard-layout">
      <DashboardHeader />

      {isLoading ? (
        <div className="surftrust-loading-container">
          <Spinner />
        </div>
      ) : analyticsData ? (
        // --- THIS IS THE FIX ---
        // The Fragment now correctly wraps both sibling elements.
        // The invalid <p> tag has been removed.
        <>
          <h2 className="surftrust-section-header">Lifetime Performance</h2>
          <StatsGrid stats={analyticsData.totals} />
        </>
      ) : (
        <p>Could not load lifetime stats.</p>
      )}

      {/* The two-column layout section remains unchanged */}
      <div className="surftrust-dashboard-main-grid">
        <div className="surftrust-dashboard-chart-wrapper">
          {isLoading ? (
            <div className="surftrust-loading-container">
              <Spinner />
            </div>
          ) : analyticsData ? (
            <PerformanceChart chartData={analyticsData.chart} />
          ) : (
            <div className="surftrust-panel">
              <p>Could not load chart data.</p>
            </div>
          )}
        </div>
        <div className="surftrust-dashboard-recent-notifications">
          <div className="surftrust-panel">
            <div className="surftrust-panel-header">
              <h2>Recent Notifications</h2>
              <Link
                to="/all-notifications"
                className="button is-secondary is-small"
              >
                View All
              </Link>
            </div>
            {isLoading ? (
              <div
                className="surftrust-loading-container"
                style={{ minHeight: "250px" }}
              >
                <Spinner />
              </div>
            ) : (
              <NotificationsTable mode="recent" limit={10} /> // Also updated this to 10 as requested
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
