import React from "react";

const TabNavigation = ({ activeTab, onTabClick }) => {
  const tabs = ["Sales Notifications", "Low Stock Alerts", "Review Displays"];

  return (
    <nav className="nav-tab-wrapper">
      {tabs.map((tab) => (
        <a
          key={tab}
          href="#"
          className={`nav-tab ${activeTab === tab ? "nav-tab-active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            onTabClick(tab);
          }}
        >
          {tab}
        </a>
      ))}
    </nav>
  );
};

export default TabNavigation;
