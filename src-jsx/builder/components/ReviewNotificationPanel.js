import React from "react";
import {
  ToggleControl,
  RangeControl,
  TextareaControl,
} from "@wordpress/components";
import DisplayRules from "./DisplayRules";
import SaveButton from "../../shared/components/SaveButton";

const ReviewNotificationPanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return <div className="surftrust-panel">Loading...</div>;
  }

  return (
    <div className="surftrust-panel">
      <h2>Customer Review Display Settings</h2>
      <p>Showcase positive customer reviews to build trust and social proof.</p>

      <hr />

      <ToggleControl
        label="Enable Review Displays"
        help={
          settings.enabled
            ? "Review pop-ups are currently active."
            : "Review pop-ups are currently disabled."
        }
        checked={settings.enabled}
        onChange={(value) => updateSetting("review_displays", "message", value)}
      />

      <hr />

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
      <TextareaControl
        label="Notification Message"
        help="Use placeholders: {reviewer_name}, {rating}, and {product_name}."
        value={settings.message}
        onChange={(value) => updateSetting("review_displays", "message", value)}
        rows={3}
      />
      <DisplayRules
        settingsGroupName="review_displays"
        settings={settings.display_rules || {}}
        updateSetting={updateSetting}
      />
      <SaveButton />
    </div>
  );
};

export default ReviewNotificationPanel;
