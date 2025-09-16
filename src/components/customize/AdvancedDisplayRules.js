// /src-jsx/components/customize/AdvancedDisplayRules.js

import React from "react";
import { ToggleControl } from "@wordpress/components";
const AdvancedDisplayRules = ({
  settings,
  updateSetting
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Advanced Display Rules"), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "Enable on Mobile Devices",
    help: settings.enable_on_mobile ? "Notifications will be shown on all devices." : "Notifications will be hidden on mobile devices.",
    checked: settings.enable_on_mobile,
    onChange: value => updateSetting("customize", "enable_on_mobile", value)
  }));
};
export default AdvancedDisplayRules;