import React from "react";
const Header = () => {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("h1", null, "Surftrust Settings"), /*#__PURE__*/React.createElement("button", {
    className: "button button-primary"
  }, "Save Changes"));
};
export default Header;