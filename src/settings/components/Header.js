// /src-jsx/components/Header.js

import React from "react";

// We now receive props: onSave function and isSaving state.
const Header = ({
  onSave,
  isSaving
}) => {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("h1", null, "Surftrust Settings"), /*#__PURE__*/React.createElement("button", {
    className: "button button-primary",
    onClick: onSave // Call the passed-in onSave function when clicked
    ,
    disabled: isSaving // Disable the button while saving
  }, isSaving ? "Saving..." : "Save Changes"));
};
export default Header;