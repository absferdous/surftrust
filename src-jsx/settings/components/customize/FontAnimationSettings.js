import React from "react";
import { RangeControl, SelectControl } from "@wordpress/components";

const FontAnimationSettings = ({ settings, updateSetting }) => {
  return (
    <>
      <h3>Fonts & Animations</h3>
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
    </>
  );
};

export default FontAnimationSettings;
