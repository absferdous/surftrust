import React from "react";
import {
  ToggleControl,
  TextareaControl,
  ColorPalette,
  SelectControl,
} from "@wordpress/components";
import DisplayRules from "./DisplayRules";
import SaveButton from "../../shared/components/SaveButton";

const SalesNotificationPanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return <div className="surftrust-panel">Loading...</div>;
  }

  // Define the color palette for the color picker
  const colors = [
    { name: "Black", color: "#000000" },
    { name: "White", color: "#ffffff" },
    { name: "Red", color: "#d63638" },
    { name: "Green", color: "#227124" },
    { name: "Blue", color: "#345cde" },
  ];

  return (
    <div className="surftrust-panel">
      <hr />

      <ToggleControl
        label="Enable Sales Notifications"
        help={
          settings.enabled
            ? "Notifications are currently active."
            : "Notifications are currently disabled."
        }
        checked={settings.enabled}
        onChange={(value) =>
          updateSetting("sales_notification", "enabled", value)
        }
      />

      <hr />

      <TextareaControl
        label="Notification Message"
        help="Customize the message shown to visitors. Use {city} and {product_name} as placeholders."
        value={settings.message}
        onChange={(value) =>
          updateSetting("sales_notification", "message", value)
        }
        rows={4}
      />

      <hr />

      <label
        style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
      >
        Notification Color
      </label>
      <ColorPalette
        colors={colors}
        value={settings.color}
        onChange={(value) =>
          updateSetting("sales_notification", "color", value)
        }
        disableCustomColors={false}
        clearable={false}
      />
      <p className="components-form-token-field__help">
        Select a highlight color for the notification.
      </p>

      <hr />

      <SelectControl
        label="Notification Position"
        value={settings.position}
        options={[
          { label: "Bottom Left", value: "bottom-left" },
          { label: "Bottom Right", value: "bottom-right" },
          { label: "Top Left", value: "top-left" },
          { label: "Top Right", value: "top-right" },
        ]}
        onChange={(value) =>
          updateSetting("sales_notification", "position", value)
        }
        __nextHasNoMarginBottom
      />
      <DisplayRules
        settingsGroupName="sales_notification"
        settings={settings.display_rules || {}}
        updateSetting={updateSetting}
      />
      <SaveButton />
    </div>
  );
};

export default SalesNotificationPanel;
