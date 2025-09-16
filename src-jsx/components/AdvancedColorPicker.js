// /src-jsx/components/AdvancedColorPicker.js

import React, { useState, useCallback } from "react";
import { ChromePicker } from "react-color";

const AdvancedColorPicker = ({ label, color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  // We use useCallback to prevent the popover from closing on every re-render
  const handleChange = useCallback(
    (newColor) => {
      // react-color gives a complex object, we just need the hex string
      onChange(newColor.hex);
    },
    [onChange]
  );

  const popover = {
    position: "absolute",
    zIndex: "2",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  return (
    <div>
      <label
        style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
      >
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "80px",
            height: "30px",
            borderRadius: "2px",
            background: color,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
          onClick={handleClick}
        />
        <span>{color}</span>
      </div>
      {displayColorPicker ? (
        <div style={popover}>
          <div style={cover} onClick={handleClose} />
          <ChromePicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

export default AdvancedColorPicker;
