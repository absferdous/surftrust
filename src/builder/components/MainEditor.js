import React from "react";
import SalesNotificationPanel from "./SalesNotificationPanel";
import StockNotificationPanel from "./StockNotificationPanel";
import ReviewNotificationPanel from "./ReviewNotificationPanel";
import CustomizePanel from "./CustomizePanel";
import CookieNoticePanel from "./CookieNoticePanel";
import GrowthAlertPanel from "./GrowthAlertPanel";
import LiveVisitorPanel from "./LiveVisitorPanel";
import SaleAnnouncementPanel from "./SaleAnnouncementPanel";
const MainEditor = ({
  settings,
  updateSetting,
  activeTab,
  setActiveTab
}) => {
  // This generic update handler is passed down to all child panels.

  // This function determines which settings panel to display based on the activeTab prop.
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
      case "live_visitors":
        return /*#__PURE__*/React.createElement(LiveVisitorPanel, {
          settings: settings.live_visitors,
          updateSetting: updateSetting
        });
      case "sale_announcement":
        return /*#__PURE__*/React.createElement(SaleAnnouncementPanel, {
          settings: settings.sale_announcement,
          updateSetting: updateSetting
        });
      case "customize":
        return /*#__PURE__*/React.createElement(CustomizePanel, {
          settings: settings.customize,
          updateSetting: updateSetting
        });
      default:
        return /*#__PURE__*/React.createElement("div", {
          className: "surftrust-panel"
        }, /*#__PURE__*/React.createElement("h2", null, "Error"), /*#__PURE__*/React.createElement("p", null, "An invalid tab was selected. Please choose a tab from the sidebar."));
    }
  };

  // The navigation items for the builder's sidebar.
  const navItems = [
  // The "Content" tab's slug is dynamically set to the notification's type.
  {
    slug: settings.type,
    title: "Content",
    icon: "dashicons-edit"
  }, {
    slug: "customize",
    title: "Customize",
    icon: "dashicons-admin-customizer"
  }];
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
      // Call the function from the parent App to change the active tab
      setActiveTab(item.slug);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `dashicons ${item.icon}`
  }), item.title))))), /*#__PURE__*/React.createElement("main", {
    className: "surftrust-main-content"
  }, renderActivePanel()));
};
export default MainEditor;