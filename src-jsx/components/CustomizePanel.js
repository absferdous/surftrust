import React from "react";
import {
  TextControl,
  RangeControl,
  ToggleControl,
  SelectControl,
} from "@wordpress/components";
import AdvancedColorPicker from "./AdvancedColorPicker"; // Import our new reusable component

const CustomizePanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return <div className="surftrust-panel">Loading...</div>;
  }

  // Helper function to handle number inputs cleanly
  const handleNumberChange = (key, value) => {
    const intValue = parseInt(value, 10);
    // We pass 'customize' as the group to our main updateSetting function in App.js
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

      <hr />
      <h3>Appearance & Branding</h3>

      <RangeControl
        label="Border Radius (px)"
        help="Controls how rounded the corners of the pop-up are."
        value={settings.border_radius}
        onChange={(value) => updateSetting("customize", "border_radius", value)}
        min={0}
        max={50}
        step={1}
      />

      <ToggleControl
        label="Enable Shadow"
        help={
          settings.enable_shadow
            ? "A subtle shadow will be displayed."
            : "No shadow will be displayed."
        }
        checked={settings.enable_shadow}
        onChange={(value) => updateSetting("customize", "enable_shadow", value)}
      />

      <hr />
      <SelectControl
        label="Font Family"
        value={settings.font_family}
        options={[
          { label: "Sans-serif (Modern)", value: "sans-serif" },
          { label: "Serif (Traditional)", value: "serif" },
          { label: "Monospace (Code)", value: "monospace" },
          { label: "Cursive (Script)", value: "cursive" },
        ]}
        onChange={(value) => updateSetting("customize", "font_family", value)}
      />

      <RangeControl
        label="Font Size (px)"
        help="Controls the size of the text inside the pop-up."
        value={settings.font_size}
        onChange={(value) => updateSetting("customize", "font_size", value)}
        min={10}
        max={24}
        step={1}
      />

      <SelectControl
        label="Animation Style"
        help="How the notification enters and exits the screen."
        value={settings.animation_style}
        options={[
          { label: "Fade", value: "fade" },
          { label: "Slide Up", value: "slide-up" },
          { label: "Slide Left", value: "slide-left" },
          { label: "Zoom", value: "zoom" },
        ]}
        onChange={(value) =>
          updateSetting("customize", "animation_style", value)
        }
      />

      <hr />
      {/* This section now uses our new, more powerful component */}
      <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
        <AdvancedColorPicker
          label="Background Color"
          color={settings.background_color}
          onChange={(value) =>
            updateSetting("customize", "background_color", value)
          }
        />
        <AdvancedColorPicker
          label="Font Color"
          color={settings.font_color}
          onChange={(value) => updateSetting("customize", "font_color", value)}
        />
      </div>

      <ToggleControl
        label="Show 'Close' Button"
        help="Allow users to dismiss a notification by clicking an 'X' icon."
        checked={settings.show_close_button}
        onChange={(value) =>
          updateSetting("customize", "show_close_button", value)
        }
      />
    </div>
  );
};

export default CustomizePanel;
