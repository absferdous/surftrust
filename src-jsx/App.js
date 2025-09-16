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
      position: "bottom-left",
    },
    low_stock_alert: {
      enabled: false,
      threshold: 5,
    },
    review_displays: {
      enabled: true,
      min_rating: 4,
    },
  });

  // --- API COMMUNICATION ---
  useEffect(() => {
    setIsLoading(true);
    apiFetch({ path: "/surftrust/v1/settings" })
      .then((fetchedSettings) => {
        // Safely merge fetched settings into our default state
        setSettings((prevSettings) => ({
          ...prevSettings,
          ...fetchedSettings,
        }));
      })
      .catch((error) => {
        console.error("Error fetching settings:", error);
        setNotice("Could not load saved settings.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setNotice(""); // Clear any previous notice before saving
    apiFetch({
      path: "/surftrust/v1/settings",
      method: "POST",
      data: settings,
    })
      .then((response) => {
        setNotice("Settings saved successfully!");
        // Make the notice disappear after 3 seconds
        setTimeout(() => setNotice(""), 3000);
      })
      .catch((error) => {
        setNotice("Error saving settings. Please try again.");
        console.error("Error saving settings:", error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const updateSetting = (group, key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [group]: {
        ...prevSettings[group],
        [key]: value,
      },
    }));
  };

  // --- RENDERING LOGIC ---
  const renderActivePanel = () => {
    // Use slugs to determine which panel to show
    switch (activeTab) {
      case "low_stock_alert":
        return (
          <StockNotificationPanel
            settings={settings.low_stock_alert}
            updateSetting={updateSetting}
          />
        );
      case "review_displays":
        return (
          <ReviewNotificationPanel
            settings={settings.review_displays}
            updateSetting={updateSetting}
          />
        );
      case "sales_notification":
      default:
        return (
          <SalesNotificationPanel
            settings={settings.sales_notification}
            updateSetting={updateSetting}
          />
        );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // We can replace this with a nice spinner later
  }

  return (
    <div>
      {/* Display the notice banner at the top if the 'notice' state is not empty */}
      {notice && (
        <div className="notice notice-success is-dismissible surftrust-notice">
          <p>{notice}</p>
        </div>
      )}

      <Header onSave={handleSaveSettings} isSaving={isSaving} />

      {/* The new flexbox-based layout wrapper */}
      <div className="surftrust-app-wrapper">
        <SidebarNav activeTab={activeTab} onTabClick={setActiveTab} />
        <main className="surftrust-main-content">{renderActivePanel()}</main>
      </div>
    </div>
  );
};

export default App;
