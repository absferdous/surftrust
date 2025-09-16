import React, { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import Header from "./components/Header";
import SidebarNav from "./components/SidebarNav"; // New sidebar component
import SalesNotificationPanel from "./components/SalesNotificationPanel/SalesNotificationPanel";
import StockNotificationPanel from "./components/StockNotificationPanel/StockNotificationPanel";
import ReviewNotificationPanel from "./components/ReviewNotificationPanel/ReviewNotificationPanel";
const App = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("sales_notification"); // Use slugs for state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState(""); // State for our success/error notice

  // The complete default settings state
  const [settings, setSettings] = useState({
    sales_notification: {
      enabled: true,
      message: "Someone in {city} just bought {product_name}!",
      color: "#227124",
      position: "bottom-left"
    },
    low_stock_alert: {
      enabled: false,
      threshold: 5
    },
    review_displays: {
      enabled: true,
      min_rating: 4
    }
  });

  // --- API COMMUNICATION ---
  useEffect(() => {
    setIsLoading(true);
    apiFetch({
      path: "/surftrust/v1/settings"
    }).then(fetchedSettings => {
      // Safely merge fetched settings into our default state
      setSettings(prevSettings => ({
        ...prevSettings,
        ...fetchedSettings
      }));
    }).catch(error => {
      console.error("Error fetching settings:", error);
      setNotice("Could not load saved settings.");
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);
  const handleSaveSettings = () => {
    setIsSaving(true);
    setNotice(""); // Clear any previous notice before saving
    apiFetch({
      path: "/surftrust/v1/settings",
      method: "POST",
      data: settings
    }).then(response => {
      setNotice("Settings saved successfully!");
      // Make the notice disappear after 3 seconds
      setTimeout(() => setNotice(""), 3000);
    }).catch(error => {
      setNotice("Error saving settings. Please try again.");
      console.error("Error saving settings:", error);
    }).finally(() => {
      setIsSaving(false);
    });
  };
  const updateSetting = (group, key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [group]: {
        ...prevSettings[group],
        [key]: value
      }
    }));
  };

  // --- RENDERING LOGIC ---
  const renderActivePanel = () => {
    // Use slugs to determine which panel to show
    switch (activeTab) {
      case "low_stock_alert":
        return /*#__PURE__*/React.createElement(StockNotificationPanel, {
          settings: settings.low_stock_alert,
          updateSetting: updateSetting
        });
      case "review_displays":
        return /*#__PURE__*/React.createElement(ReviewNotificationPanel, {
          settings: settings.review_displays,
          updateSetting: updateSetting
        });
      case "sales_notification":
      default:
        return /*#__PURE__*/React.createElement(SalesNotificationPanel, {
          settings: settings.sales_notification,
          updateSetting: updateSetting
        });
    }
  };
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", null, "Loading..."); // We can replace this with a nice spinner later
  }
  return /*#__PURE__*/React.createElement("div", null, notice && /*#__PURE__*/React.createElement("div", {
    className: "notice notice-success is-dismissible surftrust-notice"
  }, /*#__PURE__*/React.createElement("p", null, notice)), /*#__PURE__*/React.createElement(Header, {
    onSave: handleSaveSettings,
    isSaving: isSaving
  }), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-app-wrapper"
  }, /*#__PURE__*/React.createElement(SidebarNav, {
    activeTab: activeTab,
    onTabClick: setActiveTab
  }), /*#__PURE__*/React.createElement("main", {
    className: "surftrust-main-content"
  }, renderActivePanel())));
};
export default App;