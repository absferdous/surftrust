// In /builder/components/customize/AdvancedDisplayRules.js
import React from "react";
// --- 1. Import TextControl ---
import { ToggleControl, TextControl } from "@wordpress/components";
const AdvancedDisplayRules = ({
  settings,
  updateSetting
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Advanced Display Rules"), /*#__PURE__*/React.createElement(ToggleControl
  // ... (existing mobile toggle)
  , null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(TextControl, {
    label: "Frequency Capping",
    type: "number",
    help: "Maximum number of notifications to show a user per session. A session ends when the browser tab is closed. Set to 0 for unlimited.",
    value: settings.max_displays_per_session,
    onChange: value => {
      const intValue = parseInt(value, 10);
      updateSetting("customize", "max_displays_per_session", isNaN(intValue) ? 0 : intValue);
    }
  }));
};
export default AdvancedDisplayRules;