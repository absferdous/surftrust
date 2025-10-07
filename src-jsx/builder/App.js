import React, { useState, useEffect } from "react";
import { render } from "@wordpress/element";
import ChooseType from "./components/ChooseType";
import ChooseTemplate from "./components/ChooseTemplate";
import MainEditor from "./components/MainEditor";

const App = () => {
  // Read the initial settings passed from PHP when editing an existing post.
  const initialSettings = window.surftrust_admin_data.settings || {};

  // --- A Single State Object to Rule Them All ---
  // This object holds the wizard step, the settings data, and the active editor tab.
  const [builderState, setBuilderState] = useState({
    step: initialSettings.type ? "main_editor" : "choose_type",
    settings: initialSettings.type ? initialSettings : {},
    activeTab: initialSettings.type || null,
  });

  // This effect runs whenever the settings change, keeping the hidden input field in sync.
  useEffect(() => {
    const settingsInput = document.getElementById("surftrust_settings_field");
    if (settingsInput) {
      settingsInput.value = JSON.stringify(builderState.settings);
    }
  }, [builderState.settings]);

  // --- Wizard Navigation Functions ---

  const handleSelectType = (typeSlug) => {
    // Update the state to move to the next step and set the notification type.
    setBuilderState({
      step: "choose_template",
      settings: { type: typeSlug },
      activeTab: typeSlug, // Set the initial active tab for the editor
    });
  };

  // In /src-jsx/builder/App.js

  const handleSelectTemplate = (templateSettings) => {
    setBuilderState((prevState) => {
      // The previous state contains the correct 'type' we need.
      const notificationType = prevState.settings.type;

      // Create the new, complete settings object.
      const newSettings = {
        // Start with the guaranteed base structure.
        sales_notification: {},
        review_displays: {},
        low_stock_alert: {},
        cookie_notice: {},
        growth_alert: {},
        live_visitors: {},
        sale_announcement: {},
        customize: {},

        // Add the type back in.
        type: notificationType,

        // Now, merge the settings from the selected template.
        ...templateSettings,
      };

      return {
        step: "main_editor",
        settings: newSettings,
        activeTab: notificationType,
      };
    });
  };

  // --- Main Render Logic ---

  const renderWizardStep = () => {
    switch (builderState.step) {
      case "main_editor":
        return (
          <MainEditor
            settings={builderState.settings}
            setSettings={(newSettings) =>
              setBuilderState((prev) => ({ ...prev, settings: newSettings }))
            }
            activeTab={builderState.activeTab}
            setActiveTab={(tab) =>
              setBuilderState((prev) => ({ ...prev, activeTab: tab }))
            }
          />
        );
      case "choose_template":
        return (
          <ChooseTemplate
            notificationType={builderState.settings.type}
            onSelectTemplate={handleSelectTemplate}
          />
        );
      case "choose_type":
      default:
        return <ChooseType onSelectType={handleSelectType} />;
    }
  };

  return (
    <div>
      {renderWizardStep()}
      <textarea
        id="surftrust_settings_field"
        name="_surftrust_settings"
        style={{ display: "none" }}
        // Use a key to force re-render when editing a different post
        key={initialSettings.id || "new"}
        // We only need to set the default value once on initial load
        defaultValue={JSON.stringify(builderState.settings)}
      />
    </div>
  );
};

// Mount the app to the DOM
document.addEventListener("DOMContentLoaded", () => {
  const targetDiv = document.getElementById("surftrust-builder-app");
  if (targetDiv) {
    render(<App />, document.getElementById("surftrust-builder-app"));
  }
});

export default App;
