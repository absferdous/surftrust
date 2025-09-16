// /src-jsx/components/CustomizePanel.js

import React from "react";
import { TextControl } from "@wordpress/components";

const CustomizePanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return <div className="surftrust-panel">Loading...</div>;
  }

  // Helper function to handle number inputs
  const handleNumberChange = (key, value) => {
    const intValue = parseInt(value, 10);
    // We pass 'customize' as the group to our main updateSetting function
    updateSetting("customize", key, isNaN(intValue) ? 0 : intValue);
  };

  return (
    <div className="surftrust-panel">
      <h2>Global Customization</h2>
      <p>
        Control the timing, appearance, and display rules for all notifications.
      </p>

      <hr />

      <h3>Timing & Display Logic</h3>

      <TextControl
        label="Initial Delay (seconds)"
        type="number"
        help="Wait this long after the page loads before showing the first notification."
        value={settings.initial_delay}
        onChange={(value) => handleNumberChange("initial_delay", value)}
      />

      <TextControl
        label="Display Duration (seconds)"
        type="number"
        help="How long each notification stays on the screen."
        value={settings.display_duration}
        onChange={(value) => handleNumberChange("display_duration", value)}
      />

      <TextControl
        label="Delay Between Notifications (seconds)"
        type="number"
        help="How long to wait after one notification disappears before showing the next."
        value={settings.delay_between}
        onChange={(value) => handleNumberChange("delay_between", value)}
      />
    </div>
  );
};

export default CustomizePanel;
