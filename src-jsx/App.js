// /src-jsx/App.js
import React, { Suspense } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./shared/components/Layout";
import { Spinner } from "@wordpress/components";

// Lazy-load each "page" component.
// Webpack will automatically create a separate .js file for each of these.
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const AllNotifications = React.lazy(() => import("./pages/AllNotifications"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Analytics = React.lazy(() => import("./pages/Analytics"));

// A simple component to display a spinner while pages are loading.
const LoadingFallback = () => (
  <div className="surftrust-loading-container">
    <Spinner />
  </div>
);

const App = () => {
  return (
    // We use HashRouter because it's the most reliable for WordPress admin pages.
    <HashRouter>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Define the route for each of our pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/all-notifications" element={<AllNotifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Default route: redirect to the dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  );
};

export default App;
