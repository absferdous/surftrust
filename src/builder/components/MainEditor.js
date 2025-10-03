// /src-jsx/builder/components/MainEditor.js
import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import SalesNotificationPanel from "./SalesNotificationPanel";
import StockNotificationPanel from "./StockNotificationPanel";
import ReviewNotificationPanel from "./ReviewNotificationPanel";
import CustomizePanel from "./CustomizePanel";
import CookieNoticePanel from "./CookieNoticePanel";
import GrowthAlertPanel from "./GrowthAlertPanel";
import LiveVisitorPanel from "./LiveVisitorPanel";
const MainEditor = ({
  settings,
  setSettings
}) => {
  // This state is local to the editor view
  const [activeTab, setActiveTab] = useState(settings.type); // Default to the notification's type

  // A generic update handler that will be passed down to all panels
  const updateSetting = (group, key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [group]: {
        ...(prevSettings[group] || {}),
        // Ensure group exists
        [key]: value
      }
    }));
  };
  const renderActivePanel = () => {
    switch (activeTab) {
      case "sale":
        return /*#__PURE__*/React.createElement(SalesNotificationPanel, {
          settings: settings.sales_notification,
          updateSetting: updateSetting
        });
      case "stock":
        return /*#__PURE__*/React.createElement(StockNotificationPanel, {
          settings: settings.low_stock_alert,
          updateSetting: updateSetting
        });
      case "review":
        return /*#__PURE__*/React.createElement(ReviewNotificationPanel, {
          settings: settings.review_displays,
          updateSetting: updateSetting
        });
      case "cookie_notice":
        return /*#__PURE__*/React.createElement(CookieNoticePanel, {
          settings: settings.cookie_notice,
          updateSetting: updateSetting
        });
      case "growth_alert":
        return /*#__PURE__*/React.createElement(GrowthAlertPanel, {
          settings: settings.growth_alert,
          updateSetting: updateSetting
        });
      case "customize":
        return /*#__PURE__*/React.createElement(CustomizePanel, {
          settings: settings.customize,
          updateSetting: updateSetting
        });
      case "live_visitors":
        // <-- Add Case
        return /*#__PURE__*/React.createElement(LiveVisitorPanel, {
          settings: settings.live_visitors,
          updateSetting: updateSetting
        });
      default:
        return /*#__PURE__*/React.createElement("div", {
          className: "surftrust-panel"
        }, "Please select a notification type.");
    }
  };

  // We need to adjust the nav items based on the notification type
  const navItems = [{
    slug: settings.type,
    title: "Content",
    icon: "dashicons-edit"
  }, {
    slug: "customize",
    title: "Customize",
    icon: "dashicons-admin-customizer"
  }
  // We could add more tabs like 'Display Rules' here later
  ];
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-app-wrapper"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "surftrust-sidebar-nav"
  }, /*#__PURE__*/React.createElement("ul", null, navItems.map(item => /*#__PURE__*/React.createElement("li", {
    key: item.slug
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: activeTab === item.slug ? "is-active" : "",
    onClick: e => {
      e.preventDefault();
      setActiveTab(item.slug);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `dashicons ${item.icon}`
  }), item.title))))), /*#__PURE__*/React.createElement("main", {
    className: "surftrust-main-content"
  }, renderActivePanel()));
};
export default MainEditor;