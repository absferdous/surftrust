import React, { useState, useEffect, useCallback } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";

import FilterTabs from "./all-notifications/FilterTabs";
import NotificationRow from "./all-notifications/NotificationRow";
import SearchBar from "./all-notifications/SearchBar";
const AllNotifications = () => {
  // --- STATE MANAGEMENT ---
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for our filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // A simple state variable to trigger a re-fetch when an action (like duplicate) is performed
  const [dataVersion, setDataVersion] = useState(0);

  // --- DATA FETCHING ---
  // This effect re-fetches data whenever a filter or the dataVersion changes
  useEffect(() => {
    setIsLoading(true);

    const path = new URLSearchParams({
      status: statusFilter === "all" ? "" : statusFilter,
      search: searchQuery,
    });

    const fetchRequest = {
      path: `/surftrust/v1/notifications?${path.toString()}`,
      headers: { "X-WP-Nonce": window.surftrust_admin_data.nonce },
    };

    apiFetch(fetchRequest)
      .then((data) => {
        setNotifications(data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setNotifications([]); // Clear notifications on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [statusFilter, searchQuery, dataVersion]); // Dependency array now includes all triggers

  // --- HANDLER FUNCTIONS ---

  // Passed to NotificationRow to optimistically update the UI on toggle
  const handleStatusChange = useCallback((id, newStatus) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, status: newStatus } : notif
      )
    );
  }, []);

  // Passed to ActionsMenu (via NotificationRow) to trigger a data refresh
  const forceDataRefresh = () => {
    // Incrementing the version number will cause the useEffect hook to re-run
    setDataVersion((currentVersion) => currentVersion + 1);
  };

  // --- RENDER ---
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

      {isLoading ? (
        <div className="surftrust-loading-container">
          <Spinner />
        </div>
      ) : (
        <table className="wp-list-table widefat fixed striped posts surftrust-notifications-table">
          <thead>
            <tr>
              <th scope="col" className="manage-column column-title">
                Title
              </th>
              <th scope="col" className="manage-column column-type">
                Type
              </th>
              <th scope="col" className="manage-column column-status">
                Status
              </th>
              <th scope="col" className="manage-column column-stats">
                Stats
              </th>
              <th scope="col" className="manage-column column-actions">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onStatusChange={handleStatusChange}
                  onDataUpdate={forceDataRefresh} // Pass the refresh function
                />
              ))
            ) : (
              <tr>
                <td colSpan="5">No notifications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllNotifications;
