// /src-jsx/components/StockNotificationPanel.js

import React from "react";
// Import the UI components we need
import { ToggleControl, TextControl } from "@wordpress/components";

const StockNotificationPanel = ({ settings, updateSetting }) => {
  // Safety check
  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Low Stock Alert Settings</h2>
      <p>
        Notify customers when product inventory is running low to create
        urgency.
      </p>

      <hr />

      {/* == ENABLE/DISABLE TOGGLE == */}
      <ToggleControl
        label="Enable Low Stock Alerts"
        help={
          settings.enabled
            ? "Alerts are currently active."
            : "Alerts are currently disabled."
        }
        checked={settings.enabled}
        onChange={(value) => updateSetting("low_stock_alert", "enabled", value)}
      />

      <hr />

      {/* == STOCK THRESHOLD NUMBER INPUT == */}
      <TextControl
        label="Stock Threshold"
        type="number"
        help="Show alert when a product's stock is at or below this number."
        value={settings.threshold}
        onChange={(value) => {
          // Ensure the value is a positive integer
          const intValue = parseInt(value, 10);
          updateSetting(
            "low_stock_alert",
            "threshold",
            isNaN(intValue) ? 0 : intValue
          );
        }}
      />
    </div>
  );
};

export default StockNotificationPanel;
