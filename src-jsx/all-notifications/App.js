// /src-jsx/all-notifications/App.js
import React, { useState, useEffect, useCallback } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";
import FilterTabs from "./components/FilterTabs";
import NotificationRow from "./components/NotificationRow"; // <-- IMPORT THE NEW COMPONENT

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // This useEffect hook is now correct and will not cause an infinite loop.
  useEffect(() => {
    setIsLoading(true);
    const path = new URLSearchParams({
      status: statusFilter === "all" ? "" : statusFilter,
    });
    const fetchRequest = {
      path: `/surftrust/v1/notifications?${path.toString()}`,
      headers: { "X-WP-Nonce": window.surftrust_admin_data.nonce },
    };
    apiFetch(fetchRequest)
      .then((data) => setNotifications(data))
      .catch((error) => console.error("Error fetching notifications:", error))
      .finally(() => setIsLoading(false));
  }, [statusFilter]); // Dependency array tells React to re-run only when statusFilter changes

  // This function will be passed down to each NotificationRow
  // It allows a child component to update the parent's state.
  const handleStatusChange = useCallback((id, newStatus) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, status: newStatus } : notif
      )
    );
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                // --- ADD THIS LOG ---
                console.log(
                  "App.js is sending this prop to NotificationRow:",
                  notification
                );
                return (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onStatusChange={handleStatusChange}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No notifications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
