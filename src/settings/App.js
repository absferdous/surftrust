import React, { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Spinner } from "@wordpress/components";
import Header from "../builder/components/Header";
import CustomizePanel from "../builder/components/CustomizePanel";
const App = () => {
  // --- STATE MANAGEMENT ---
  // This app is now ONLY responsible for the 'customize' settings.
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [settings, setSettings] = useState(/* ... your full default settings object ... */
  {
    sales_notification: {
      enabled: true,
      message: "{first_name} in {city} just bought {product_name}!",
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
    },
    customize: {
      initial_delay: 3,
      display_duration: 5,
      delay_between: 2,
      border_radius: 6,
      enable_shadow: true,
      font_family: "sans-serif",
      font_size: 14,
      animation_style: "fade",
      background_color: "#ffffff",
      font_color: "#000000",
      show_close_button: true,
      enable_on_mobile: true,
      max_displays_per_session: 10
    }
  });

  // This useEffect hook is now much simpler.
  useEffect(() => {
    setIsLoading(true);
    apiFetch({
      path: "/surftrust/v1/settings"
    }).then(fetchedSettings => {
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
    setNotice("");
    apiFetch({
      path: "/surftrust/v1/settings",
      method: "POST",
      data: settings
    }).then(() => {
      setNotice("Global settings saved successfully!");
      setTimeout(() => setNotice(""), 3000);
    }).catch(error => {
      setNotice("Error saving settings.");
      console.error("Error saving settings:", error);
    }).finally(() => setIsSaving(false));
  };

  // The updateSetting function is now simpler as well.
  const updateSetting = (group, key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [group]: {
        ...prevSettings[group],
        [key]: value
      }
    }));
  };
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-loading-container"
    }, /*#__PURE__*/React.createElement(Spinner, null));
  }
  return /*#__PURE__*/React.createElement("div", null, notice && /*#__PURE__*/React.createElement("div", {
    className: "notice notice-success is-dismissible surftrust-notice"
  }, /*#__PURE__*/React.createElement("p", null, notice)), /*#__PURE__*/React.createElement(Header, {
    onSave: handleSaveSettings,
    isSaving: isSaving,
    title: "Global Settings"
  }), /*#__PURE__*/React.createElement(CustomizePanel, {
    settings: settings.customize,
    updateSetting: updateSetting
  }));
};
export default App;