// /src-jsx/dashboard/components/DashboardHeader.js
import React from "react";

const DashboardHeader = () => {
  return (
    <div className="surftrust-dashboard-header">
      <div>
        <h1>Welcome to Surftrust</h1>
        <p>Here's a snapshot of your notification performance.</p>
      </div>
      <div>
        <a
          href="post-new.php?post_type=st_notification"
          className="button button-primary button-hero"
        >
          + Add New Notification
        </a>
      </div>
    </div>
  );
};

export default DashboardHeader;
