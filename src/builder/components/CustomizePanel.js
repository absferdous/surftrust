import React from "react";
import TimingSettings from "../../settings/components/customize/TimingSettings";
import BrandingSettings from "../../settings/components/customize/BrandingSettings";
import FontAnimationSettings from "../../settings/components/customize/FontAnimationSettings";
import AdvancedDisplayRules from "../../settings/components/customize/AdvancedDisplayRules";
import SaveButton from "../../shared/components/SaveButton";
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
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(AdvancedDisplayRules, {
    settings: settings,
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement(SaveButton, null));
};
export default CustomizePanel;