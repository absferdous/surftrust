// /src-jsx/pages/all-notifications/components/NotificationsTable.js

import React, { useState, useEffect, useCallback } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";
import NotificationRow from "./NotificationRow"; // Adjusted path

const NotificationsTable = ({
  // Props to control the component's behavior
  mode = "full", // 'full' or 'recent'
  limit = -1, // Max number of notifications to show, -1 for all
  status = "all",
  search = "",
}) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      status: status === "all" ? "" : status,
      search: search,
      per_page: limit, // Use the limit prop
      orderby: "date",
      order: "desc",
    });

    apiFetch({ path: `/surftrust/v1/notifications?${params.toString()}` })
      .then((data) => setNotifications(data))
      .catch((error) => console.error("Error fetching notifications:", error))
      .finally(() => setIsLoading(false));
  }, [status, search, limit, dataVersion]);

  const handleStatusChange = useCallback((id, newStatus) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n))
    );
  }, []);

  const forceDataRefresh = () => {
    setDataVersion((v) => v + 1);
  };

  if (isLoading) {
    return (
      <div
        className="surftrust-loading-container"
        style={{ minHeight: "200px" }}
      >
        <Spinner />
      </div>
    );
  }

  // A different header for 'recent' mode on the dashboard
  const isRecentMode = mode === "recent";

  return (
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
          {/* Only show Stats and Actions in full mode */}
          {!isRecentMode && (
            <th scope="col" className="manage-column column-stats">
              Stats
            </th>
          )}
          {!isRecentMode && (
            <th scope="col" className="manage-column column-actions">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onStatusChange={handleStatusChange}
              onDataUpdate={forceDataRefresh}
              // Pass down the mode to hide columns in the row component
              mode={mode}
            />
          ))
        ) : (
          <tr>
            <td colSpan={isRecentMode ? 3 : 5}>No notifications found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default NotificationsTable;
