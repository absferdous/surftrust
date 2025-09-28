// /src-jsx/all-notifications/components/NotificationRow.js

import React from "react";
import apiFetch from "@wordpress/api-fetch";
// --- 1. IMPORT THE ToggleControl COMPONENT ---
import { ToggleControl } from "@wordpress/components";
const NotificationRow = ({
  notification,
  onStatusChange
}) => {
  const {
    id,
    title,
    type,
    status,
    stats = {
      views: 0,
      clicks: 0
    }
  } = notification;
  const handleToggleStatus = isEnabled => {
    const newStatus = isEnabled ? "publish" : "draft";
    // Optimistically update the UI
    onStatusChange(id, newStatus);

    // Send the API request
    apiFetch({
      path: `/surftrust/v1/notifications/${id}/toggle`,
      method: "POST",
      headers: {
        "X-WP-Nonce": window.surftrust_admin_data.nonce
      }
    }).catch(error => {
      console.error("Failed to toggle status:", error);
      onStatusChange(id, status); // Revert on failure
      alert("Error: Could not update the notification status.");
    });
  };
  const isEnabled = status === "publish";
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "title column-title"
  }, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement("a", {
    href: `post.php?post=${id}&action=edit`
  }, title))), /*#__PURE__*/React.createElement("td", {
    className: "type column-type",
    "data-colname": "Type"
  }, type.charAt(0).toUpperCase() + type.slice(1)), /*#__PURE__*/React.createElement("td", {
    className: "status column-status",
    "data-colname": "Status"
  }, /*#__PURE__*/React.createElement(ToggleControl, {
    checked: isEnabled,
    onChange: handleToggleStatus
  })), /*#__PURE__*/React.createElement("td", {
    className: "stats column-stats",
    "data-colname": "Stats"
  }, stats.views, " Views / ", stats.clicks, " Clicks"));
};
export default NotificationRow;