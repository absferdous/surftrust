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
      headers: { "X-WP-Nonce": window.surftrust_admin_data.nonce },
    };
    apiFetch(fetchRequest)
      .then((fetchedSettings) => {
        // We provide a default for customize to prevent errors if settings are empty
        const fullSettings = { customize: {}, ...fetchedSettings };
        setSettings(fullSettings);
      })
      .catch(() => setNotice("Error: Could not load global settings."))
      .finally(() => setIsLoading(false));
  }, []);

  const updateSetting = (group, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [group]: { ...(prev[group] || {}), [key]: value },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setNotice("");
    apiFetch({
      path: "/surftrust/v1/settings",
      method: "POST",
      data: settings,
      headers: { "X-WP-Nonce": window.surftrust_admin_data.nonce },
    })
      .then(() => {
        setNotice("Global settings saved successfully!");
        setTimeout(() => setNotice(""), 3000);
      })
      .catch(() => setNotice("Error: Could not save settings."))
      .finally(() => setIsSaving(false));
  };

  if (isLoading || !settings) {
    return (
      <div className="surftrust-loading-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="surftrust-page-header">
        <h1>Global Settings</h1>
      </div>

      {/* Success/Error Notice */}
      {notice && (
        <div
          className="notice notice-success is-dismissible"
          style={{ marginBottom: "20px" }}
        >
          <p>{notice}</p>
        </div>
      )}

      {/* The Main Settings Panel */}
      <CustomizePanel
        settings={settings.customize}
        updateSetting={updateSetting}
      />

      {/* The Save Button at the Bottom */}
      <div className="surftrust-save-button-wrapper">
        <Button
          onClick={handleSave}
          className="surftrust-save-button"
          isPrimary
          isBusy={isSaving}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
