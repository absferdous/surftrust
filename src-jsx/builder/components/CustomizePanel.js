import React from "react";
import TimingSettings from "../../settings/components/customize/TimingSettings";
import BrandingSettings from "../../settings/components/customize/BrandingSettings";
import FontAnimationSettings from "../../settings/components/customize/FontAnimationSettings";
import AdvancedDisplayRules from "../../settings/components/customize/AdvancedDisplayRules";
const CustomizePanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return <div className="surftrust-panel">Loading...</div>;
  }

  return (
    <div className="surftrust-panel">
      <h2>Global Customization</h2>
      <p>
        Control the timing, appearance, and display rules for all notifications.
      </p>

      <hr />
      <TimingSettings settings={settings} updateSetting={updateSetting} />

      <hr />
      <BrandingSettings settings={settings} updateSetting={updateSetting} />

      <hr />
      <FontAnimationSettings
        settings={settings}
        updateSetting={updateSetting}
      />
      <hr />
      <AdvancedDisplayRules settings={settings} updateSetting={updateSetting} />
    </div>
  );
};

export default CustomizePanel;
