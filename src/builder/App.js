// /src-jsx/builder/App.js

import React, { useState, useEffect } from "react";
import ChooseType from "./components/ChooseType";
import ChooseTemplate from "./components/ChooseTemplate";
import MainEditor from "./components/MainEditor";
const App = () => {
  // --- START CHANGE: Initialize state from the global object ---
  // Read the settings passed from our PHP localize script.
  // We use || {} to provide a safe fallback.
  const initialSettings = window.surftrust_admin_data.settings || {};
  const [settings, setSettings] = useState(initialSettings);
  // --- END CHANGE ---

  // Determine the initial wizard step based on whether a 'type' is already set.
  const [wizardStep, setWizardStep] = useState(initialSettings.type ? "main_editor" : "choose_type");

  // This effect syncs the React state back to the hidden input for saving.
  useEffect(() => {
    const settingsInput = document.getElementById("surftrust_settings_field");
    if (settingsInput) {
      settingsInput.value = JSON.stringify(settings);
    }
  }, [settings]);
  const handleSelectType = typeSlug => {
    setSettings({
      type: typeSlug
    });
    setWizardStep("choose_template");
  };
  const handleSelectTemplate = templateSettings => {
    // templateSettings now contains the full combined settings object
    setSettings(prevSettings => ({
      ...prevSettings,
      ...templateSettings
    }));
    setWizardStep("main_editor");
  };
  const renderWizardStep = () => {
    switch (wizardStep) {
      case "main_editor":
        return /*#__PURE__*/React.createElement(MainEditor, {
          settings: settings,
          setSettings: setSettings
        });
      case "choose_template":
        return /*#__PURE__*/React.createElement(ChooseTemplate, {
          notificationType: settings.type,
          onSelectTemplate: handleSelectTemplate
        });
      case "choose_type":
      default:
        return /*#__PURE__*/React.createElement(ChooseType, {
          onSelectType: handleSelectType
        });
    }
  };
  return /*#__PURE__*/React.createElement("div", null, renderWizardStep(), /*#__PURE__*/React.createElement("textarea", {
    id: "surftrust_settings_field",
    name: "_surftrust_settings",
    style: {
      display: "none"
    }
    // We use defaultValue to handle the initial load, then the useEffect handles updates.
    ,
    defaultValue: JSON.stringify(initialSettings)
  }));
};
export default App;