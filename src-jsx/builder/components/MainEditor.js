import React from "react";
import SalesNotificationPanel from "./SalesNotificationPanel";
import StockNotificationPanel from "./StockNotificationPanel";
import ReviewNotificationPanel from "./ReviewNotificationPanel";
import CustomizePanel from "./CustomizePanel";
import CookieNoticePanel from "./CookieNoticePanel";
import GrowthAlertPanel from "./GrowthAlertPanel";
import LiveVisitorPanel from "./LiveVisitorPanel";
import SaleAnnouncementPanel from "./SaleAnnouncementPanel";

const MainEditor = ({ settings, setSettings, activeTab, setActiveTab }) => {
  // This generic update handler is passed down to all child panels.
  // It calls the main 'setSettings' function provided by the parent App.
  const updateSetting = (group, key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [group]: {
        ...(prevSettings[group] || {}), // Ensure the group object exists
        [key]: value,
      },
    }));
  };

  // This function determines which settings panel to display based on the activeTab prop.
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
      case "cookie_notice":
        return (
          <CookieNoticePanel
            settings={settings.cookie_notice}
            updateSetting={updateSetting}
          />
        );
      case "growth_alert":
        return (
          <GrowthAlertPanel
            settings={settings.growth_alert}
            updateSetting={updateSetting}
          />
        );
      case "live_visitors":
        return (
          <LiveVisitorPanel
            settings={settings.live_visitors}
            updateSetting={updateSetting}
          />
        );
      case "sale_announcement":
        return (
          <SaleAnnouncementPanel
            settings={settings.sale_announcement}
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
        return (
          <div className="surftrust-panel">
            <h2>Error</h2>
            <p>
              An invalid tab was selected. Please choose a tab from the sidebar.
            </p>
          </div>
        );
    }
  };

  // The navigation items for the builder's sidebar.
  const navItems = [
    // The "Content" tab's slug is dynamically set to the notification's type.
    { slug: settings.type, title: "Content", icon: "dashicons-edit" },
    {
      slug: "customize",
      title: "Customize",
      icon: "dashicons-admin-customizer",
    },
  ];

  return (
    <div className="surftrust-app-wrapper">
      <nav className="surftrust-sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.slug}>
              <a
                href="#"
                className={activeTab === item.slug ? "is-active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  // Call the function from the parent App to change the active tab
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
