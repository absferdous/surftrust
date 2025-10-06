// /src-jsx/builder/components/LiveVisitorPanel.js
import React from "react";
import { TextareaControl } from "@wordpress/components";
import DisplayRules from "./DisplayRules";
const LiveVisitorPanel = ({
  settings,
  updateSetting
}) => {
  if (!settings) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "Live Visitor Count Settings"), /*#__PURE__*/React.createElement("p", null, "Display a pop-up showing the number of current visitors on your site."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(TextareaControl, {
    label: "Notification Message",
    help: "Customize the message. Use {count} as a placeholder for the number of live visitors.",
    value: settings.message,
    onChange: value => updateSetting("live_visitors", "message", value)
  }), /*#__PURE__*/React.createElement(DisplayRules, {
    settingsGroupName: "live_visitors",
    settings: settings.display_rules || {},
    updateSetting: updateSetting
  }));
};
export default LiveVisitorPanel;