// /src-jsx/builder/App.js

import React, { useState, useEffect } from "react"; // Import useEffect
import ChooseType from "./components/ChooseType";
import ChooseTemplate from "./components/ChooseTemplate";
import MainEditor from "./components/MainEditor";

const App = () => {
  const [settings, setSettings] = useState({ type: null });
  const [wizardStep, setWizardStep] = useState("choose_type");

  // --- NEW: useEffect to sync state with hidden input ---
  // This effect runs every time the 'settings' object changes.
  useEffect(() => {
    // Find our hidden textarea in the DOM.
    const settingsInput = document.getElementById("surftrust_settings_field");
    if (settingsInput) {
      // Convert the settings object to a JSON string and update the textarea's value.
      settingsInput.value = JSON.stringify(settings);
    }
  }, [settings]); // The dependency array ensures this only runs when 'settings' changes.

  const handleSelectType = (typeSlug) => {
    setSettings({ type: typeSlug });
    setWizardStep("choose_template");
  };

  const handleSelectTemplate = (templateSettings) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...templateSettings }));
    setWizardStep("main_editor");
  };

  const renderWizardStep = () => {
    switch (wizardStep) {
      case "main_editor":
        return <MainEditor settings={settings} setSettings={setSettings} />;
      case "choose_template":
        return (
          <ChooseTemplate
            notificationType={settings.type}
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

      {/* --- NEW: The hidden textarea for saving data --- */}
      {/* The name '_surftrust_settings' is what we will look for in our PHP save function. */}
      <textarea
        id="surftrust_settings_field"
        name="_surftrust_settings"
        style={{ display: "none" }}
        readOnly // We only control its value from React
      />
    </div>
  );
};

export default App;
