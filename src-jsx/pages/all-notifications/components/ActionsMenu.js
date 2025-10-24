// /src-jsx/all-notifications/components/ActionsMenu.js

import React from "react";
import apiFetch from "@wordpress/api-fetch";
// We need to import Button as well for the dropdown to work correctly
import { Dropdown, Button, MenuGroup, MenuItem } from "@wordpress/components";

const ActionsMenu = ({ notification, onUpdate }) => {
  const { id } = notification;

  const handleDuplicate = () => {
    if (
      !window.confirm("Are you sure you want to duplicate this notification?")
    ) {
      return;
    }
    apiFetch({
      path: `/surftrust/v1/notifications/${id}/duplicate`,
      method: "POST",
      headers: { "X-WP-Nonce": window.surftrust_admin_data.nonce },
    })
      .then((result) => {
        alert(
          "Notification duplicated successfully! The new draft has been created.you can see it in the disabled tab"
        );
        onUpdate(); // Tell the parent App to re-fetch the list
      })
      .catch((error) => {
        console.error("Duplication failed:", error);
        alert("Error: Could not duplicate notification.");
      });
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        "Are you sure you want to move this notification to the trash?"
      )
    ) {
      return;
    }

    apiFetch({
      path: `/surftrust/v1/notifications/${id}`,
      method: "DELETE", // Use the DELETE HTTP method
      headers: { "X-WP-Nonce": window.surftrust_admin_data.nonce },
    })
      .then((result) => {
        alert("Notification moved to trash.");
        onUpdate(); // Tell the parent to re-fetch the list
      })
      .catch((error) => {
        console.error("Delete failed:", error);
        alert("Error: Could not move notification to trash.");
      });
  };

  return (
    <Dropdown
      className="surftrust-actions-menu"
      contentClassName="surftrust-actions-menu-content"
      // The renderToggle prop is the correct way to define the button
      renderToggle={({ isOpen, onToggle }) => (
        <Button
          icon="ellipsis"
          label="Actions"
          onClick={onToggle}
          aria-expanded={isOpen}
        />
      )}
      // The renderContent prop is the correct way to define the dropdown's content
      renderContent={() => (
        <MenuGroup>
          <MenuItem href={`post.php?post=${id}&action=edit`}>Edit</MenuItem>
          <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
          <MenuItem isDestructive onClick={handleDelete}>
            Delete
          </MenuItem>
        </MenuGroup>
      )}
    />
  );
};

export default ActionsMenu;
