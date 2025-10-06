// /src-jsx/builder/components/CookieNoticePanel.js
import React from "react";
import { TextControl, TextareaControl } from "@wordpress/components";
import DisplayRules from "./DisplayRules";
import SaveButton from "../../shared/components/SaveButton";
const CookieNoticePanel = ({
  settings,
  updateSetting
}) => {
  if (!settings) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "Cookie Notice Settings"), /*#__PURE__*/React.createElement("p", null, "Configure the content of your cookie consent pop-up."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(TextareaControl, {
    label: "Notice Message",
    help: "The main text displayed to the user.",
    value: settings.message,
    onChange: value => updateSetting("cookie_notice", "message", value)
  }), /*#__PURE__*/React.createElement(TextControl, {
    label: "Accept Button Text",
    value: settings.button_text,
    onChange: value => updateSetting("cookie_notice", "button_text", value)
  }), /*#__PURE__*/React.createElement(DisplayRules, {
    settingsGroupName: "cookie_notice",
    settings: settings.display_rules || {},
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement(SaveButton, null));
};
export default CookieNoticePanel;