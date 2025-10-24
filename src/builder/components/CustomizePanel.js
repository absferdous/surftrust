// /src-jsx/builder/components/CustomizePanel.js

import React from "react";
// We ONLY import the components that a campaign can override.
import BrandingSettings from "../../settings/components/customize/BrandingSettings";
import FontAnimationSettings from "../../settings/components/customize/FontAnimationSettings";
import AdvancedDisplayRules from "../../settings/components/customize/AdvancedDisplayRules";
import SaveButton from "../../shared/components/SaveButton";
const CustomizePanel = ({
  settings,
  updateSetting
}) => {
  // The 'settings' prop is the 'customize' object for this specific campaign.
  if (!settings) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-panel"
    }, "Loading...");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("p", null, "Override the default look, feel, and targeting rules for this campaign only."), /*#__PURE__*/React.createElement(BrandingSettings, {
    settings: settings,
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(FontAnimationSettings, {
    settings: settings,
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(AdvancedDisplayRules, {
    settings: settings,
    updateSetting: updateSetting,
    isCampaign: true
  }), /*#__PURE__*/React.createElement(SaveButton, null));
};
export default CustomizePanel;