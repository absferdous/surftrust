// /src-jsx/shared/components/GlobalSidebarNav.js
import React from "react";
// --- 1. Import Link and useLocation ---
import { Link, useLocation } from "react-router-dom";
const navItems = [{
  path: "/dashboard",
  title: "Dashboard",
  icon: "dashicons-dashboard"
}, {
  path: "/all-notifications",
  title: "All Notifications",
  icon: "dashicons-menu-alt"
},
// This is now an internal route, not a direct PHP link
{
  path: "/builder/new",
  title: "Add New",
  icon: "dashicons-plus"
}, {
  path: "/settings",
  title: "Settings",
  icon: "dashicons-admin-settings"
}, {
  path: "/analytics",
  title: "Analytics",
  icon: "dashicons-chart-area"
}];
const GlobalSidebarNav = () => {
  // --- 2. Use the useLocation hook to find the current path ---
  const location = useLocation();
  const currentPath = location.pathname;
  return /*#__PURE__*/React.createElement("nav", {
    className: "surftrust-sidebar-nav"
  }, /*#__PURE__*/React.createElement("ul", null, navItems.map(item => {
    const isActive = currentPath === item.path;
    return /*#__PURE__*/React.createElement("li", {
      key: item.path
    }, /*#__PURE__*/React.createElement(Link, {
      to: item.path,
      className: isActive ? "is-active" : ""
    }, /*#__PURE__*/React.createElement("span", {
      className: `dashicons ${item.icon}`
    }), item.title));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      paddingTop: "20px",
      borderTop: "1px solid #dcdcde"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "index.php"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dashicons dashicons-arrow-left-alt"
  }), "Back to WP Dashboard")));
};
export default GlobalSidebarNav;