import React from "react";
import TimingSettings from "./customize/TimingSettings";
import BrandingSettings from "./customize/BrandingSettings";
import FontAnimationSettings from "./customize/FontAnimationSettings";
const CustomizePanel = ({
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
  }, /*#__PURE__*/React.createElement("h2", null, "Global Customization"), /*#__PURE__*/React.createElement("p", null, "Control the timing, appearance, and display rules for all notifications."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(TimingSettings, {
    settings: settings,
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(BrandingSettings, {
    settings: settings,
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(FontAnimationSettings, {
    settings: settings,
    updateSetting: updateSetting
  }));
};
export default CustomizePanel;