// /src-jsx/builder/components/MainEditor.js
import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import SalesNotificationPanel from "./SalesNotificationPanel";
import StockNotificationPanel from "./StockNotificationPanel";
import ReviewNotificationPanel from "./ReviewNotificationPanel";
import CustomizePanel from "./CustomizePanel";

const MainEditor = ({ settings, setSettings }) => {
  // This state is local to the editor view
  const [activeTab, setActiveTab] = useState(settings.type); // Default to the notification's type

  // A generic update handler that will be passed down to all panels
  const updateSetting = (group, key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [group]: {
        ...(prevSettings[group] || {}), // Ensure group exists
        [key]: value,
      },
    }));
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case "sale":
        return (
          <SalesNotificationPanel
            settings={settings.sales_notification}
            updateSetting={updateSetting}
          />
        );
      case "stock":
        return (
          <StockNotificationPanel
            settings={settings.low_stock_alert}
            updateSetting={updateSetting}
          />
        );
      case "review":
        return (
          <ReviewNotificationPanel
            settings={settings.review_displays}
            updateSetting={updateSetting}
          />
        );
      case "customize":
        return (
          <CustomizePanel
            settings={settings.customize}
            updateSetting={updateSetting}
          />
        );
      default:
        return <div>Please select a valid tab.</div>;
    }
  };

  // We need to adjust the nav items based on the notification type
  const navItems = [
    { slug: settings.type, title: "Content", icon: "dashicons-edit" },
    {
      slug: "customize",
      title: "Customize",
      icon: "dashicons-admin-customizer",
    },
    // We could add more tabs like 'Display Rules' here later
  ];

  return (
    <div className="surftrust-app-wrapper">
      {/* We can create a simplified SidebarNav for the builder later */}
      {/* For now, let's reuse the concept */}
      <nav className="surftrust-sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.slug}>
              <a
                href="#"
                className={activeTab === item.slug ? "is-active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.slug);
                }}
              >
                <span className={`dashicons ${item.icon}`}></span>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main className="surftrust-main-content">{renderActivePanel()}</main>
    </div>
  );
};

export default MainEditor;
