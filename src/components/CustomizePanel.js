import React from "react";
import { TextControl, RangeControl, ToggleControl, SelectControl } from "@wordpress/components";
const CustomizePanel = ({
  settings,
  updateSetting
}) => {
  if (!settings) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-panel"
    }, "Loading...");
  }

  // Helper function to handle number inputs cleanly
  const handleNumberChange = (key, value) => {
    const intValue = parseInt(value, 10);
    // We pass 'customize' as the group to our main updateSetting function in App.js
    updateSetting("customize", key, isNaN(intValue) ? 0 : intValue);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "Global Customization"), /*#__PURE__*/React.createElement("p", null, "Control the timing, appearance, and display rules for all notifications."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h3", null, "Timing & Display Logic"), /*#__PURE__*/React.createElement(TextControl, {
    label: "Initial Delay (seconds)",
    type: "number",
    help: "Wait this long after the page loads before showing the first notification.",
    value: settings.initial_delay,
    onChange: value => handleNumberChange("initial_delay", value)
  }), /*#__PURE__*/React.createElement(TextControl, {
    label: "Display Duration (seconds)",
    type: "number",
    help: "How long each notification stays on the screen.",
    value: settings.display_duration,
    onChange: value => handleNumberChange("display_duration", value)
  }), /*#__PURE__*/React.createElement(TextControl, {
    label: "Delay Between Notifications (seconds)",
    type: "number",
    help: "How long to wait after one notification disappears before showing the next.",
    value: settings.delay_between,
    onChange: value => handleNumberChange("delay_between", value)
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h3", null, "Appearance & Branding"), /*#__PURE__*/React.createElement(RangeControl, {
    label: "Border Radius (px)",
    help: "Controls how rounded the corners of the pop-up are.",
    value: settings.border_radius,
    onChange: value => updateSetting("customize", "border_radius", value),
    min: 0 // Sharp corners
    ,
    max: 50 // Pill-shaped
    ,
    step: 1
  }), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "Enable Shadow",
    help: settings.enable_shadow ? "A subtle shadow will be displayed." : "No shadow will be displayed.",
    checked: settings.enable_shadow,
    onChange: value => updateSetting("customize", "enable_shadow", value)
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(SelectControl, {
    label: "Font Family",
    value: settings.font_family,
    options: [{
      label: "Sans-serif (Modern)",
      value: "sans-serif"
    }, {
      label: "Serif (Traditional)",
      value: "serif"
    }, {
      label: "Monospace (Code)",
      value: "monospace"
    }, {
      label: "Cursive (Script)",
      value: "cursive"
    }],
    onChange: value => updateSetting("customize", "font_family", value)
  }), /*#__PURE__*/React.createElement(RangeControl, {
    label: "Font Size (px)",
    help: "Controls the size of the text inside the pop-up.",
    value: settings.font_size,
    onChange: value => updateSetting("customize", "font_size", value),
    min: 10,
    max: 24,
    step: 1
  }), /*#__PURE__*/React.createElement(SelectControl, {
    label: "Animation Style",
    help: "How the notification enters and exits the screen.",
    value: settings.animation_style,
    options: [{
      label: "Fade",
      value: "fade"
    }, {
      label: "Slide Up",
      value: "slide-up"
    }, {
      label: "Slide Left",
      value: "slide-left"
    }, {
      label: "Zoom",
      value: "zoom"
    }],
    onChange: value => updateSetting("customize", "animation_style", value)
  }));
};
export default CustomizePanel;