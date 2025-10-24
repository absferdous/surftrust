// /src-jsx/pages/all-notifications/components/NotificationsTable.js

import React, { useState, useEffect, useCallback } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";
import NotificationRow from "./NotificationRow"; // Adjusted path

const NotificationsTable = ({
  // Props to control the component's behavior
  mode = "full",
  // 'full' or 'recent'
  limit = -1,
  // Max number of notifications to show, -1 for all
  status = "all",
  search = ""
}) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      status: status === "all" ? "" : status,
      search: search,
      per_page: limit,
      // Use the limit prop
      orderby: "date",
      order: "desc"
    });
    apiFetch({
      path: `/surftrust/v1/notifications?${params.toString()}`
    }).then(data => setNotifications(data)).catch(error => console.error("Error fetching notifications:", error)).finally(() => setIsLoading(false));
  }, [status, search, limit, dataVersion]);
  const handleStatusChange = useCallback((id, newStatus) => {
    setNotifications(prev => prev.map(n => n.id === id ? {
      ...n,
      status: newStatus
    } : n));
  }, []);
  const forceDataRefresh = () => {
    setDataVersion(v => v + 1);
  };
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-loading-container",
      style: {
        minHeight: "200px"
      }
    }, /*#__PURE__*/React.createElement(Spinner, null));
  }

  // A different header for 'recent' mode on the dashboard
  const isRecentMode = mode === "recent";
  return /*#__PURE__*/React.createElement("table", {
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
  }, "Status"), !isRecentMode && /*#__PURE__*/React.createElement("th", {
    scope: "col",
    className: "manage-column column-stats"
  }, "Stats"), !isRecentMode && /*#__PURE__*/React.createElement("th", {
    scope: "col",
    className: "manage-column column-actions"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, notifications.length > 0 ? notifications.map(notification => /*#__PURE__*/React.createElement(NotificationRow, {
    key: notification.id,
    notification: notification,
    onStatusChange: handleStatusChange,
    onDataUpdate: forceDataRefresh
    // Pass down the mode to hide columns in the row component
    ,
    mode: mode
  })) : /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: isRecentMode ? 3 : 5
  }, "No notifications found."))));
};
export default NotificationsTable;