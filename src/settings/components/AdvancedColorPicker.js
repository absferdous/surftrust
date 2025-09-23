// /src-jsx/components/AdvancedColorPicker.js

import React, { useState, useCallback } from "react";
import { ChromePicker } from "react-color";
const AdvancedColorPicker = ({
  label,
  color,
  onChange
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };
  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  // We use useCallback to prevent the popover from closing on every re-render
  const handleChange = useCallback(newColor => {
    // react-color gives a complex object, we just need the hex string
    onChange(newColor.hex);
  }, [onChange]);
  const popover = {
    position: "absolute",
    zIndex: "2"
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "80px",
      height: "30px",
      borderRadius: "2px",
      background: color,
      border: "1px solid #ccc",
      cursor: "pointer"
    },
    onClick: handleClick
  }), /*#__PURE__*/React.createElement("span", null, color)), displayColorPicker ? /*#__PURE__*/React.createElement("div", {
    style: popover
  }, /*#__PURE__*/React.createElement("div", {
    style: cover,
    onClick: handleClose
  }), /*#__PURE__*/React.createElement(ChromePicker, {
    color: color,
    onChange: handleChange
  })) : null);
};
export default AdvancedColorPicker;