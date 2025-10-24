// /src-jsx/pages/AllNotifications.js

import React, { useState } from "react";
import FilterTabs from "./all-notifications/components/FilterTabs";
import SearchBar from "./all-notifications/components/SearchBar";
import NotificationsTable from "./all-notifications/components/NotificationsTable"; // Import our new component

const AllNotifications = () => {
  // State for our filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="surftrust-all-notifications-header">
        <h1>Notifications</h1>
        <a
          href="post-new.php?post_type=st_notification"
          className="page-title-action"
        >
          Add New Notification
        </a>
      </div>

      <div className="surftrust-filters">
        <FilterTabs
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
        <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
      </div>

      {/* All the table and fetching logic is now inside this one component */}
      <NotificationsTable
        mode="full"
        status={statusFilter}
        search={searchQuery}
      />
    </div>
  );
};

export default AllNotifications;
