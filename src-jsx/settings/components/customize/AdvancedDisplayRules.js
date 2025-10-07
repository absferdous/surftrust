// In /builder/components/customize/AdvancedDisplayRules.js
import React from "react";
// --- 1. Import TextControl ---
import { ToggleControl, TextControl } from "@wordpress/components";

const AdvancedDisplayRules = ({ settings, updateSetting }) => {
  return (
    <>
      <h3>Advanced Display Rules</h3>
      <ToggleControl
      // ... (existing mobile toggle)
      />

      {/* --- 2. ADD THIS NEW COMPONENT --- */}
      <hr />
      <TextControl
        label="Frequency Capping"
        type="number"
        help="Maximum number of notifications to show a user per session. A session ends when the browser tab is closed. Set to 0 for unlimited."
        value={settings.max_displays_per_session}
        onChange={(value) => {
          const intValue = parseInt(value, 10);
          updateSetting(
            "customize",
            "max_displays_per_session",
            isNaN(intValue) ? 0 : intValue
          );
        }}
      />
    </>
  );
};

export default AdvancedDisplayRules;
