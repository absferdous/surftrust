// /src-jsx/settings/components/Header.js

import React from "react";

// 1. Add 'title' to the destructured props
const Header = ({
  onSave,
  isSaving,
  title
}) => {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("h1", null, title || "Surftrust Settings"), /*#__PURE__*/React.createElement("button", {
    className: "button button-primary",
    onClick: onSave,
    disabled: isSaving
  }, isSaving ? "Saving..." : "Save Changes"));
};
export default Header;