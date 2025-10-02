// /src-jsx/builder/components/GrowthAlertPanel.js
import React from "react";
import { TextControl, ToggleControl } from "@wordpress/components";

const GrowthAlertPanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return null;
  }

  return (
    <div className="surftrust-panel">
      <h2>Growth Alert Settings</h2>
      <p>Configure the social share pop-up.</p>
      <hr />
      <TextControl
        label="Main Message"
        help="The heading that encourages users to share."
        value={settings.message}
        onChange={(value) => updateSetting("growth_alert", "message", value)}
      />
      <hr />
      <h3>Enabled Social Networks</h3>
      <ToggleControl
        label="Facebook"
        checked={settings.enable_facebook}
        onChange={(value) =>
          updateSetting("growth_alert", "enable_facebook", value)
        }
      />
      <ToggleControl
        label="X (Twitter)"
        checked={settings.enable_twitter}
        onChange={(value) =>
          updateSetting("growth_alert", "enable_twitter", value)
        }
      />
      <ToggleControl
        label="Pinterest"
        checked={settings.enable_pinterest}
        onChange={(value) =>
          updateSetting("growth_alert", "enable_pinterest", value)
        }
      />
    </div>
  );
};

export default GrowthAlertPanel;
