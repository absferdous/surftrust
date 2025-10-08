// /src-jsx/sidebar.js
import React from "react";
import { render } from "@wordpress/element";
import GlobalSidebarNav from "./shared/components/GlobalSidebarNav";
document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("surftrust-sidebar-root");
  if (target) {
    render(/*#__PURE__*/React.createElement(GlobalSidebarNav, null), target);
  }
});