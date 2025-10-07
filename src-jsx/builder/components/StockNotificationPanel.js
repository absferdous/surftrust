import React from "react";
import {
  ToggleControl,
  TextControl,
  TextareaControl,
} from "@wordpress/components";
import DisplayRules from "./DisplayRules";
import SaveButton from "../../shared/components/SaveButton";

const StockNotificationPanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return <div className="surftrust-panel">Loading...</div>;
  }

  return (
    <div className="surftrust-panel">
      <h2>Low Stock Alert Settings</h2>
      <p>
        Notify customers when product inventory is running low to create
        urgency.
      </p>

      <hr />

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
      <TextareaControl
        label="Notification Message"
        help="Customize the message. Use {product_name} and {stock_count} as placeholders."
        value={settings.message}
        onChange={(value) => updateSetting("low_stock_alert", "message", value)}
      />

      <TextControl
        label="Stock Threshold"
        type="number"
        help="Show alert when a product's stock is at or below this number."
        value={settings.threshold}
        onChange={(value) => {
          const intValue = parseInt(value, 10);
          updateSetting(
            "low_stock_alert",
            "threshold",
            isNaN(intValue) ? 0 : intValue
          );
        }}
      />
      <DisplayRules
        settingsGroupName="low_stock_alert"
        settings={settings.display_rules || {}}
        updateSetting={updateSetting}
      />
      <SaveButton />
    </div>
  );
};

export default StockNotificationPanel;
