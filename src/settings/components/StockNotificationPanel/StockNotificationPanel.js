import React from "react";
import { ToggleControl, TextControl } from "@wordpress/components";
const StockNotificationPanel = ({
  settings,
  updateSetting
}) => {
  if (!settings) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-panel"
    }, "Loading...");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "Low Stock Alert Settings"), /*#__PURE__*/React.createElement("p", null, "Notify customers when product inventory is running low to create urgency."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "Enable Low Stock Alerts",
    help: settings.enabled ? "Alerts are currently active." : "Alerts are currently disabled.",
    checked: settings.enabled,
    onChange: value => updateSetting("low_stock_alert", "enabled", value)
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(TextControl, {
    label: "Stock Threshold",
    type: "number",
    help: "Show alert when a product's stock is at or below this number.",
    value: settings.threshold,
    onChange: value => {
      const intValue = parseInt(value, 10);
      updateSetting("low_stock_alert", "threshold", isNaN(intValue) ? 0 : intValue);
    }
  }));
};
export default StockNotificationPanel;