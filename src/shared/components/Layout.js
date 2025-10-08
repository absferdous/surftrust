// /src-jsx/shared/components/Layout.js
import React from "react";
import GlobalSidebarNav from "./GlobalSidebarNav";
const Layout = ({
  children
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-app-wrapper"
  }, /*#__PURE__*/React.createElement(GlobalSidebarNav, null), /*#__PURE__*/React.createElement("main", {
    className: "surftrust-main-content"
  }, children));
};
export default Layout;