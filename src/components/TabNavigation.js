import React from "react";
const TabNavigation = ({
  activeTab,
  onTabClick
}) => {
  const tabs = ["Sales Notifications", "Low Stock Alerts", "Review Displays"];
  return /*#__PURE__*/React.createElement("nav", {
    className: "nav-tab-wrapper"
  }, tabs.map(tab => /*#__PURE__*/React.createElement("a", {
    key: tab,
    href: "#",
    className: `nav-tab ${activeTab === tab ? "nav-tab-active" : ""}`,
    onClick: e => {
      e.preventDefault();
      onTabClick(tab);
    }
  }, tab)));
};
export default TabNavigation;