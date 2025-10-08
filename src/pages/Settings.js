// /src-jsx/pages/Settings.js

import React, { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Spinner, Button } from "@wordpress/components";
import CustomizePanel from "../builder/components/CustomizePanel";
const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    setIsLoading(true);
    const fetchRequest = {
      path: "/surftrust/v1/settings",
      headers: {
        "X-WP-Nonce": window.surftrust_admin_data.nonce
      }
    };
    apiFetch(fetchRequest).then(fetchedSettings => {
      // We provide a default for customize to prevent errors if settings are empty
      const fullSettings = {
        customize: {},
        ...fetchedSettings
      };
      setSettings(fullSettings);
    }).catch(() => setNotice("Error: Could not load global settings.")).finally(() => setIsLoading(false));
  }, []);
  const updateSetting = (group, key, value) => {
    setSettings(prev => ({
      ...prev,
      [group]: {
        ...(prev[group] || {}),
        [key]: value
      }
    }));
  };
  const handleSave = () => {
    setIsSaving(true);
    setNotice("");
    apiFetch({
      path: "/surftrust/v1/settings",
      method: "POST",
      data: settings,
      headers: {
        "X-WP-Nonce": window.surftrust_admin_data.nonce
      }
    }).then(() => {
      setNotice("Global settings saved successfully!");
      setTimeout(() => setNotice(""), 3000);
    }).catch(() => setNotice("Error: Could not save settings.")).finally(() => setIsSaving(false));
  };
  if (isLoading || !settings) {
    return /*#__PURE__*/React.createElement("div", {
      className: "surftrust-loading-container"
    }, /*#__PURE__*/React.createElement(Spinner, null));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "surftrust-page-header"
  }, /*#__PURE__*/React.createElement("h1", null, "Global Settings")), notice && /*#__PURE__*/React.createElement("div", {
    className: "notice notice-success is-dismissible",
    style: {
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("p", null, notice)), /*#__PURE__*/React.createElement(CustomizePanel, {
    settings: settings.customize,
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-save-button-wrapper"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: handleSave,
    className: "surftrust-save-button",
    isPrimary: true,
    isBusy: isSaving,
    disabled: isSaving
  }, isSaving ? "Saving..." : "Save Changes")));
};
export default Settings;