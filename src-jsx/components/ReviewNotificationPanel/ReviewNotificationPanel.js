// /src-jsx/components/ReviewNotificationPanel.js

import React from "react";
// Import the UI components we need
import { ToggleControl, RangeControl } from "@wordpress/components";

const ReviewNotificationPanel = ({ settings, updateSetting }) => {
  // Safety check
  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Customer Review Display Settings</h2>
      <p>Showcase positive customer reviews to build trust and social proof.</p>

      <hr />

      {/* == ENABLE/DISABLE TOGGLE == */}
      <ToggleControl
        label="Enable Review Displays"
        help={
          settings.enabled
            ? "Review pop-ups are currently active."
            : "Review pop-ups are currently disabled."
        }
        checked={settings.enabled}
        onChange={(value) => updateSetting("review_displays", "enabled", value)}
      />

      <hr />

      {/* == MINIMUM RATING SLIDER == */}
      <RangeControl
        label="Minimum Rating to Display"
        help="Only show reviews that have a rating of this number or higher."
        value={settings.min_rating}
        onChange={(value) =>
          updateSetting("review_displays", "min_rating", value)
        }
        min={1}
        max={5}
        step={1}
      />
    </div>
  );
};

export default ReviewNotificationPanel;
