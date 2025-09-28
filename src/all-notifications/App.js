import React, { useState, useEffect, useCallback } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";
import FilterTabs from "./components/FilterTabs";
import SearchBar from "./components/SearchBar";
import NotificationRow from "./components/NotificationRow";
const App = () => {
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
      search: searchQuery
    });
    const fetchRequest = {
      path: `/surftrust/v1/notifications?${path.toString()}`,
      headers: {
        "X-WP-Nonce": window.surftrust_admin_data.nonce
      }
    };
    apiFetch(fetchRequest).then(data => {
      setNotifications(data);
    }).catch(error => {
      console.error("Error fetching notifications:", error);
      setNotifications([]); // Clear notifications on error
    }).finally(() => {
      setIsLoading(false);
    });
  }, [statusFilter, searchQuery, dataVersion]); // Dependency array now includes all triggers

  // --- HANDLER FUNCTIONS ---

  // Passed to NotificationRow to optimistically update the UI on toggle
  const handleStatusChange = useCallback((id, newStatus) => {
    setNotifications(prevNotifications => prevNotifications.map(notif => notif.id === id ? {
      ...notif,
      status: newStatus
    } : notif));
  }, []);

  // Passed to ActionsMenu (via NotificationRow) to trigger a data refresh
  const forceDataRefresh = () => {
    // Incrementing the version number will cause the useEffect hook to re-run
    setDataVersion(currentVersion => currentVersion + 1);
  };

  // --- RENDER ---
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "surftrust-all-notifications-header"
  }, /*#__PURE__*/React.createElement("h1", null, "Notifications"), /*#__PURE__*/React.createElement("a", {
    href: "post-new.php?post_type=st_notification",
    className: "page-title-action"
  }, "Add New Notification")), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-filters"
  }, /*#__PURE__*/React.createElement(FilterTabs, {
    activeFilter: statusFilter,
    onFilterChange: setStatusFilter
  }), /*#__PURE__*/React.createElement(SearchBar, {
    searchQuery: searchQuery,
    onSearch: setSearchQuery
  })), isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "surftrust-loading-container"
  }, /*#__PURE__*/React.createElement(Spinner, null)) : /*#__PURE__*/React.createElement("table", {
    className: "wp-list-table widefat fixed striped posts surftrust-notifications-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    scope: "col",
    className: "manage-column column-title"
  }, "Title"), /*#__PURE__*/React.createElement("th", {
    scope: "col",
    className: "manage-column column-type"
  }, "Type"), /*#__PURE__*/React.createElement("th", {
    scope: "col",
    className: "manage-column column-status"
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    scope: "col",
    className: "manage-column column-stats"
  }, "Stats"), /*#__PURE__*/React.createElement("th", {
    scope: "col",
    className: "manage-column column-actions"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, notifications.length > 0 ? notifications.map(notification => /*#__PURE__*/React.createElement(NotificationRow, {
    key: notification.id,
    notification: notification,
    onStatusChange: handleStatusChange,
    onDataUpdate: forceDataRefresh // Pass the refresh function
  })) : /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "5"
  }, "No notifications found.")))));
};
export default App;