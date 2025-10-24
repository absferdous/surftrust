// /src-jsx/settings/components/customize/DeviceTargetingSettings.js
import React from "react";
import { RadioControl } from "@wordpress/components";
const DeviceTargetingSettings = ({
  settings,
  updateSetting,
  isCampaign = false
}) => {
  const options = [
  // Conditionally add the "Use Global Default" option for campaign settings
  ...(isCampaign ? [{
    label: "Use Global Default",
    value: "global"
  }] : []), {
    label: "Show on Desktop & Mobile",
    value: "all"
  }, {
    label: "Show on Desktop Only",
    value: "desktop"
  }, {
    label: "Show on Mobile Only",
    value: "mobile"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Device Targeting"), /*#__PURE__*/React.createElement(RadioControl, {
    label: "Control which devices this notification will appear on.",
    selected: settings.device_targeting || (isCampaign ? "global" : "all"),
    options: options,
    onChange: value => updateSetting("customize", "device_targeting", value)
  }));
};
export default DeviceTargetingSettings;