// /src-jsx/all-notifications/components/NotificationRow.js

import React from "react";
import apiFetch from "@wordpress/api-fetch";
import { ToggleControl } from "@wordpress/components";
// --- 1. IMPORT THE ActionsMenu COMPONENT ---
import ActionsMenu from "./ActionsMenu";

// --- 2. ADD 'onDataUpdate' TO THE PROPS ---
const NotificationRow = ({ notification, onStatusChange, onDataUpdate }) => {
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
      headers: { "X-WP-Nonce": window.surftrust_admin_data.nonce },
    }).catch((error) => {
      console.error("Failed to toggle status:", error);
      onStatusChange(id, status);
      alert("Error: Could not update the notification status.");
    });
  };

  const isEnabled = status === "publish";

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
      <td className="stats column-stats" data-colname="Stats">
        {stats.views} Views / {stats.clicks} Clicks
      </td>

      {/* --- 3. ADD THE FINAL <td> FOR THE ACTIONS MENU --- */}
      <td className="actions column-actions" data-colname="Actions">
        <ActionsMenu notification={notification} onUpdate={onDataUpdate} />
      </td>
    </tr>
  );
};

export default NotificationRow;
