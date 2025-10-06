// /src-jsx/builder/components/DisplayRules.js
import React from "react";
import PostSelector from "./PostSelector"; // Make sure this path is correct

const DisplayRules = ({
  settingsGroupName,
  settings,
  updateSetting
}) => {
  const handleShowOnChange = selectedPosts => {
    updateSetting(settingsGroupName, "display_rules", {
      ...settings,
      show_on: selectedPosts // selectedPosts is now an array of {id, title} objects
    });
  };
  const handleHideOnChange = selectedPosts => {
    updateSetting(settingsGroupName, "display_rules", {
      ...settings,
      hide_on: selectedPosts
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h3", null, "Display Rules"), /*#__PURE__*/React.createElement("p", null, "Leave both blank to show on all pages. Start typing to search for posts, pages, or products."), /*#__PURE__*/React.createElement(PostSelector, {
    label: "Show ONLY on these pages:",
    value: settings.show_on || [],
    onChange: handleShowOnChange
  }), /*#__PURE__*/React.createElement(PostSelector, {
    label: "Hide on these pages:",
    value: settings.hide_on || [],
    onChange: handleHideOnChange
  }));
};
export default DisplayRules;