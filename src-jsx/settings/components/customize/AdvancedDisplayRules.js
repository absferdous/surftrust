// /src-jsx/settings/components/customize/AdvancedDisplayRules.js

import React from "react";
import { RadioControl, TextControl } from "@wordpress/components";

const AdvancedDisplayRules = ({
  settings,
  updateSetting,
  isCampaign = false,
}) => {
  const deviceOptions = [
    ...(isCampaign ? [{ label: "Use Global Default", value: "global" }] : []),
    { label: "Show on Desktop & Mobile", value: "all" },
    { label: "Show on Desktop Only", value: "desktop" },
    { label: "Show on Mobile Only", value: "mobile" },
  ];

  return (
    <>
      <h3>Advanced Display Rules</h3>

      <RadioControl
        label="Device Targeting"
        help={
          isCampaign
            ? "Override the global device targeting."
            : "Set the default device targeting."
        }
        selected={settings.device_targeting || (isCampaign ? "global" : "all")}
        options={deviceOptions}
        onChange={(value) =>
          updateSetting("customize", "device_targeting", value)
        }
      />

      {/* This section will now ONLY render if `isCampaign` is false. */}
      {!isCampaign && (
        <>
          <hr />
          <TextControl
            label="Frequency Capping"
            type="number"
            help="Maximum notifications to show a user per session. Set to 0 for unlimited."
            value={settings.max_displays_per_session || 0}
            onChange={(value) => {
              const intValue = parseInt(value, 10);
              updateSetting(
                "customize",
                "max_displays_per_session",
                isNaN(intValue) || intValue < 0 ? 0 : intValue
              );
            }}
          />
        </>
      )}
    </>
  );
};

export default AdvancedDisplayRules;
