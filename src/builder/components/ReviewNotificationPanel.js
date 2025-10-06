import React from "react";
import { ToggleControl, RangeControl, TextareaControl } from "@wordpress/components";
import DisplayRules from "./DisplayRules";
const ReviewNotificationPanel = ({
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
  }, /*#__PURE__*/React.createElement("h2", null, "Customer Review Display Settings"), /*#__PURE__*/React.createElement("p", null, "Showcase positive customer reviews to build trust and social proof."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "Enable Review Displays",
    help: settings.enabled ? "Review pop-ups are currently active." : "Review pop-ups are currently disabled.",
    checked: settings.enabled,
    onChange: value => updateSetting("review_displays", "enabled", value)
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(RangeControl, {
    label: "Minimum Rating to Display",
    help: "Only show reviews that have a rating of this number or higher.",
    value: settings.min_rating,
    onChange: value => updateSetting("review_displays", "min_rating", value),
    min: 1,
    max: 5,
    step: 1
  }), /*#__PURE__*/React.createElement(TextareaControl, {
    label: "Notification Message",
    help: "Use placeholders: {reviewer_name}, {rating}, and {product_name}.",
    value: settings.message,
    onChange: value => updateSetting("review_displays", "message", value),
    rows: 3
  }), /*#__PURE__*/React.createElement(DisplayRules, {
    settingsGroupName: "review_displays",
    settings: settings.display_rules || {},
    updateSetting: updateSetting
  }));
};
export default ReviewNotificationPanel;