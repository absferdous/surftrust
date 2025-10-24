// /src-jsx/pages/Settings.js
import React, { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { Button, Spinner, Notice } from "@wordpress/components";

// Import all the components that belong on the GLOBAL settings page
import TimingSettings from "../settings/components/customize/TimingSettings";
import BrandingSettings from "../settings/components/customize/BrandingSettings";
import FontAnimationSettings from "../settings/components/customize/FontAnimationSettings";
import AdvancedDisplayRules from "../settings/components/customize/AdvancedDisplayRules";
const Settings = () => {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    apiFetch({
      path: "/surftrust/v1/settings"
    }).then(data => {
      setSettings(data);
      setIsLoading(false);
    });
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
    apiFetch({
      path: "/surftrust/v1/settings",
      method: "POST",
      data: settings
    }).then(() => {
      setIsSaving(false);
      setNotice({
        status: "success",
        message: "Settings saved!"
      });
    }).catch(err => {
      setIsSaving(false);
      setNotice({
        status: "error",
        message: "Error saving settings."
      });
      console.error(err);
    });
  };
  if (isLoading) {
    return /*#__PURE__*/React.createElement(Spinner, null);
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("h1", null, "Global Settings"), /*#__PURE__*/React.createElement(Button, {
    isPrimary: true,
    isBusy: isSaving,
    onClick: handleSave
  }, "Save Changes")), notice && /*#__PURE__*/React.createElement(Notice, {
    status: notice.status,
    onRemove: () => setNotice(null),
    isDismissible: true
  }, notice.message), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("p", null, "These settings control the default look, feel, and behavior for all notifications site-wide."), /*#__PURE__*/React.createElement(TimingSettings, {
    settings: settings.customize || {},
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(BrandingSettings, {
    settings: settings.customize || {},
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(FontAnimationSettings, {
    settings: settings.customize || {},
    updateSetting: updateSetting
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(AdvancedDisplayRules, {
    settings: settings.customize || {},
    updateSetting: updateSetting
  })), /*#__PURE__*/React.createElement("div", {
    class: "surftrust-save-button-wrapper"
  }, /*#__PURE__*/React.createElement(Button, {
    isPrimary: true,
    isBusy: isSaving,
    onClick: handleSave
  }, isSaving ? "Saving..." : "Save Changes")));
};
export default Settings;