import React from "react";
import { RangeControl, ToggleControl } from "@wordpress/components";
import AdvancedColorPicker from "../AdvancedColorPicker";
const BrandingSettings = ({
  settings,
  updateSetting
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Appearance & Branding"), /*#__PURE__*/React.createElement(RangeControl, {
    label: "Border Radius (px)",
    help: "Controls how rounded the corners of the pop-up are.",
    value: settings.border_radius,
    onChange: value => updateSetting("customize", "border_radius", value),
    min: 0,
    max: 50,
    step: 1
  }), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "Enable Shadow",
    help: settings.enable_shadow ? "A subtle shadow will be displayed." : "No shadow will be displayed.",
    checked: settings.enable_shadow,
    onChange: value => updateSetting("customize", "enable_shadow", value)
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "40px",
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement(AdvancedColorPicker, {
    label: "Background Color",
    color: settings.background_color,
    onChange: value => updateSetting("customize", "background_color", value)
  }), /*#__PURE__*/React.createElement(AdvancedColorPicker, {
    label: "Font Color",
    color: settings.font_color,
    onChange: value => updateSetting("customize", "font_color", value)
  })), /*#__PURE__*/React.createElement(ToggleControl, {
    label: "Show 'Close' Button",
    help: "Allow users to dismiss a notification by clicking an 'X' icon.",
    checked: settings.show_close_button,
    onChange: value => updateSetting("customize", "show_close_button", value)
  }));
};
export default BrandingSettings;