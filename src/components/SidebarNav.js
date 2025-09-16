// /src-jsx/components/SidebarNav.js
import React from "react";

// Using WordPress Dashicons for a native feel
const navItems = [{
  slug: "sales_notification",
  title: "Sales Notifications",
  icon: "dashicons-chart-line"
}, {
  slug: "low_stock_alert",
  title: "Low Stock Alerts",
  icon: "dashicons-warning"
}, {
  slug: "review_displays",
  title: "Review Displays",
  icon: "dashicons-star-filled"
}];
const SidebarNav = ({
  activeTab,
  onTabClick
}) => {
  return /*#__PURE__*/React.createElement("nav", {
    className: "surftrust-sidebar-nav"
  }, /*#__PURE__*/React.createElement("ul", null, navItems.map(item => /*#__PURE__*/React.createElement("li", {
    key: item.slug
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: activeTab === item.slug ? "is-active" : "",
    onClick: e => {
      e.preventDefault();
      onTabClick(item.slug);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `dashicons ${item.icon}`
  }), item.title)))));
};
export default SidebarNav;