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
    apiFetch({ path: "/surftrust/v1/settings" }).then((data) => {
      setSettings(data);
      setIsLoading(false);
    });
  }, []);

  const updateSetting = (group, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [group]: { ...(prev[group] || {}), [key]: value },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    apiFetch({ path: "/surftrust/v1/settings", method: "POST", data: settings })
      .then(() => {
        setIsSaving(false);
        setNotice({ status: "success", message: "Settings saved!" });
      })
      .catch((err) => {
        setIsSaving(false);
        setNotice({ status: "error", message: "Error saving settings." });
        console.error(err);
      });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Global Settings</h1>
        {/* --- TOP SAVE BUTTON --- */}
        <Button isPrimary isBusy={isSaving} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
      {notice && (
        <Notice
          status={notice.status}
          onRemove={() => setNotice(null)}
          isDismissible
        >
          {notice.message}
        </Notice>
      )}

      <div className="surftrust-panel">
        <p>
          These settings control the default look, feel, and behavior for all
          notifications site-wide.
        </p>

        <TimingSettings
          settings={settings.customize || {}}
          updateSetting={updateSetting}
        />
        <hr />
        <BrandingSettings
          settings={settings.customize || {}}
          updateSetting={updateSetting}
        />
        <hr />
        <FontAnimationSettings
          settings={settings.customize || {}}
          updateSetting={updateSetting}
        />
        <hr />
        <AdvancedDisplayRules
          settings={settings.customize || {}}
          updateSetting={updateSetting}
        />
      </div>

      {/* --- THIS IS THE NEW BOTTOM SAVE BUTTON --- */}
      <div class="surftrust-save-button-wrapper">
        <Button isPrimary isBusy={isSaving} onClick={handleSave}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
