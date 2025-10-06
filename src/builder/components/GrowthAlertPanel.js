// /src-jsx/builder/components/GrowthAlertPanel.js
import React from "react";
import { TextControl, ToggleControl } from "@wordpress/components";
import DisplayRules from "./DisplayRules";
import SaveButton from "../../shared/components/SaveButton";
const GrowthAlertPanel = ({
  settings,
  updateSetting
}) => {
  if (!settings) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "Growth Alert Settings"), /*#__PURE__*/React.createElement("p", null, "Configure the social share pop-up."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(TextControl, {
    label: "Main Message",
    help: "The heading that encourages users to share.",
    value: settings.message,
    onChange: value => updateSetting("growth_alert", "message", value)
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h3", null, "Enabled Social Networks"), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "Facebook",
    checked: settings.enable_facebook,
    onChange: value => updateSetting("growth_alert", "enable_facebook", value)
  }), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "X (Twitter)",
    checked: settings.enable_twitter,
    onChange: value => updateSetting("growth_alert", "enable_twitter", value)
  }), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "Pinterest",
    checked: settings.enable_pinterest,
    onChange: value => updateSetting("growth_alert", "enable_pinterest", value)
  }), /*#__PURE__*/React.createElement(DisplayRules, {
    settingsGroupName: "growth_alert",
    settings: settings.display_rules || {},
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement(SaveButton, null));
};
export default GrowthAlertPanel;