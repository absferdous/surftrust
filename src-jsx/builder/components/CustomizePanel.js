// /src-jsx/builder/components/CustomizePanel.js

import React from "react";
// We ONLY import the components that a campaign can override.
import BrandingSettings from "../../settings/components/customize/BrandingSettings";
import FontAnimationSettings from "../../settings/components/customize/FontAnimationSettings";
import AdvancedDisplayRules from "../../settings/components/customize/AdvancedDisplayRules";
import SaveButton from "../../shared/components/SaveButton";

const CustomizePanel = ({ settings, updateSetting }) => {
  // The 'settings' prop is the 'customize' object for this specific campaign.
  if (!settings) {
    return <div className="surftrust-panel">Loading...</div>;
  }

  return (
    <div className="surftrust-panel">
      <p>
        Override the default look, feel, and targeting rules for this campaign
        only.
      </p>

      {/* TimingSettings is GONE from this component. */}

      <BrandingSettings settings={settings} updateSetting={updateSetting} />
      <hr />
      <FontAnimationSettings
        settings={settings}
        updateSetting={updateSetting}
      />
      <hr />
      {/* We pass `isCampaign={true}` to hide the Frequency Capping option. */}
      <AdvancedDisplayRules
        settings={settings}
        updateSetting={updateSetting}
        isCampaign={true}
      />

      <SaveButton />
    </div>
  );
};

export default CustomizePanel;
