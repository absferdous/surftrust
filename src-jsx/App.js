// /src-jsx/App.js

import React, { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch"; // The WordPress API Fetch utility
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import SalesNotificationPanel from "./components/SalesNotificationPanel/SalesNotificationPanel";
import StockNotificationPanel from "./components/StockNotificationPanel/StockNotificationPanel";
import ReviewNotificationPanel from "./components/ReviewNotificationPanel/ReviewNotificationPanel";

const App = () => {
  // --- STATE MANAGEMENT ---

  const [activeTab, setActiveTab] = useState("Sales Notifications");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // This is our single source of truth for all settings.
  const [settings, setSettings] = useState({
    sales_notification: {
      // Note: Corrected from sales_notifications to match DB
      enabled: true,
      message: "Someone in {city} just bought {product_name}!",
    },
    low_stock_alert: {
      // Note: Corrected from low_stock_alerts to match DB
      enabled: false,
      threshold: 5,
    },
    review_displays: {
      enabled: true,
      min_rating: 4,
    },
  });

  // --- API COMMUNICATION ---

  // useEffect runs when the component first mounts. Perfect for fetching initial data.
  useEffect(() => {
    setIsLoading(true);
    // Our GET endpoint from Phase 3
    apiFetch({ path: "/surftrust/v1/settings" })
      .then((fetchedSettings) => {
        // --- THIS IS THE CORRECTED LOGIC ---
        // Merge the fetched settings into our default state.
        // This ensures that if a key is missing from the database,
        // our default value from the initial state is used and can be saved later.
        setSettings((prevSettings) => ({
          ...prevSettings,
          ...fetchedSettings,
        }));
      })
      .catch((error) => {
        console.error("Error fetching settings:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // The empty array [] means this effect runs only once.

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Our POST endpoint from Phase 3
    apiFetch({
      path: "/surftrust/v1/settings",
      method: "POST",
      data: settings,
    })
      .then((response) => {
        console.log("Settings saved successfully!", response);
        // Here you could show a success notice to the user
      })
      .catch((error) => {
        console.error("Error saving settings:", error);
        // Here you could show an error notice
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // This generic handler updates any setting based on its key and value.
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
    // We will now pass down the relevant settings and the update function to each panel.
    switch (activeTab) {
      case "Low Stock Alerts":
        return (
          <StockNotificationPanel
            settings={settings.low_stock_alert}
            updateSetting={updateSetting}
          />
        );
      case "Review Displays":
        return (
          <ReviewNotificationPanel
            settings={settings.review_displays}
            updateSetting={updateSetting}
          />
        );
      case "Sales Notifications":
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
    return <div>Loading settings...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Header onSave={handleSaveSettings} isSaving={isSaving} />
      <TabNavigation activeTab={activeTab} onTabClick={setActiveTab} />
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#fff",
          border: "1px solid #ccd0d4",
        }}
      >
        {renderActivePanel()}
      </div>
    </div>
  );
};

export default App;
