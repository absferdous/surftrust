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
  mode = "full",
}) => {
  const {
    id,
    title,
    type,
    status,
    stats = { views: 0, clicks: 0 },
  } = notification;

  const handleToggleStatus = (isEnabled) => {
    const newStatus = isEnabled ? "publish" : "draft";
    onStatusChange(id, newStatus);

    apiFetch({
      path: `/surftrust/v1/notifications/${id}/toggle`,
      method: "POST",
    }).catch((error) => {
      console.error("Failed to toggle status:", error);
      onStatusChange(id, status); // Revert on failure
      alert("Error: Could not update the notification status.");
    });
  };

  const isEnabled = status === "publish";
  const isRecentMode = mode === "recent";

  return (
    <tr>
      <td className="title column-title">
        <strong>
          <a href={`post.php?post=${id}&action=edit`}>{title}</a>
        </strong>
      </td>
      <td className="type column-type" data-colname="Type">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </td>
      <td className="status column-status" data-colname="Status">
        <ToggleControl checked={isEnabled} onChange={handleToggleStatus} />
      </td>

      {/* --- 2. Conditionally render the last two columns --- */}
      {!isRecentMode && (
        <td className="stats column-stats" data-colname="Stats">
          {stats.views} Views / {stats.clicks} Clicks
        </td>
      )}
      {!isRecentMode && (
        <td className="actions column-actions" data-colname="Actions">
          <ActionsMenu notification={notification} onUpdate={onDataUpdate} />
        </td>
      )}
    </tr>
  );
};

export default NotificationRow;
