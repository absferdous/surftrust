// /src-jsx/components/SalesNotificationPanel.js

import React from "react";
// Import the new UI components we need
import { ToggleControl, TextareaControl, ColorPalette, SelectControl } from "@wordpress/components";
const SalesNotificationPanel = ({
  settings,
  updateSetting
}) => {
  // Check if settings object exists to prevent errors
  if (!settings) {
    return /*#__PURE__*/React.createElement("div", null, "Loading...");
  }

  // Define the color palette for the color picker. These are default WordPress colors.
  const colors = [{
    name: "Black",
    color: "#000000"
  }, {
    name: "White",
    color: "#ffffff"
  }, {
    name: "Red",
    color: "#d63638"
  }, {
    name: "Green",
    color: "#227124"
  }, {
    name: "Blue",
    color: "#345cde"
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Sales Notification Settings"), /*#__PURE__*/React.createElement("p", null, "Customize the appearance of recent sales pop-ups."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "Enable Sales Notifications",
    help: settings.enabled ? "Notifications are currently active." : "Notifications are currently disabled.",
    checked: settings.enabled,
    onChange: value => updateSetting("sales_notification", "enabled", value)
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(TextareaControl, {
    label: "Notification Message",
    help: "Customize the message shown to visitors. Use {city} and {product_name} as placeholders.",
    value: settings.message,
    onChange: value => updateSetting("sales_notification", "message", value),
    rows: 4
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold"
    }
  }, "Notification Color"), /*#__PURE__*/React.createElement(ColorPalette, {
    colors: colors,
    value: settings.color,
    onChange: value => updateSetting("sales_notification", "color", value),
    disableCustomColors: false,
    clearable: false
  }), /*#__PURE__*/React.createElement("p", {
    className: "components-form-token-field__help"
  }, "Select a highlight color for the notification."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(SelectControl, {
    label: "Notification Position",
    value: settings.position,
    options: [{
      label: "Bottom Left",
      value: "bottom-left"
    }, {
      label: "Bottom Right",
      value: "bottom-right"
    }, {
      label: "Top Left",
      value: "top-left"
    }, {
      label: "Top Right",
      value: "top-right"
    }],
    onChange: value => updateSetting("sales_notification", "position", value),
    __nextHasNoMarginBottom: true
  }));
};
export default SalesNotificationPanel;