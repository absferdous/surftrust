// /src-jsx/pages/all-notifications/NotificationRow.js

import React from "react";
import apiFetch from "@wordpress/api-fetch";
import { ToggleControl } from "@wordpress/components";
import ActionsMenu from "./ActionsMenu"; // Adjusted path

// --- 1. Add 'mode' to the props ---
const NotificationRow = ({
  notification,
  onStatusChange,
  onDataUpdate,
  mode = "full"
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
    onStatusChange(id, newStatus);
    apiFetch({
      path: `/surftrust/v1/notifications/${id}/toggle`,
      method: "POST"
    }).catch(error => {
      console.error("Failed to toggle status:", error);
      onStatusChange(id, status); // Revert on failure
      alert("Error: Could not update the notification status.");
    });
  };
  const isEnabled = status === "publish";
  const isRecentMode = mode === "recent";
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
  })), !isRecentMode && /*#__PURE__*/React.createElement("td", {
    className: "stats column-stats",
    "data-colname": "Stats"
  }, stats.views, " Views / ", stats.clicks, " Clicks"), !isRecentMode && /*#__PURE__*/React.createElement("td", {
    className: "actions column-actions",
    "data-colname": "Actions"
  }, /*#__PURE__*/React.createElement(ActionsMenu, {
    notification: notification,
    onUpdate: onDataUpdate
  })));
};
export default NotificationRow;