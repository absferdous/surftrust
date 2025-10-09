// /src-jsx/pages/Builder.js

import React, { useState, useEffect } from "react";
// Correct the import paths to go up one level from /pages/
import ChooseType from "../builder/components/ChooseType";
import ChooseTemplate from "../builder/components/ChooseTemplate";
import MainEditor from "../builder/components/MainEditor";

const Builder = () => {
  // Read the initial settings passed from PHP when editing an existing post.
  const initialSettings = window.surftrust_admin_data.settings || {};

  const [builderState, setBuilderState] = useState({
    step: initialSettings.type ? "main_editor" : "choose_type",
    settings: initialSettings.type ? initialSettings : {},
    activeTab: initialSettings.type || null,
  });

  // This effect syncs the React state back to the hidden input for saving.
  useEffect(() => {
    const settingsInput = document.getElementById("surftrust_settings_field");
    if (settingsInput) {
      settingsInput.value = JSON.stringify(builderState.settings);
    }
  }, [builderState.settings]);

  const handleSelectType = (typeSlug) => {
    setBuilderState({
      step: "choose_template",
      settings: { type: typeSlug },
      activeTab: typeSlug,
    });
  };

  const handleSelectTemplate = (templateSettings) => {
    setBuilderState((prevState) => ({
      step: "main_editor",
      settings: {
        // Guaranteed base structure
        sales_notification: {},
        review_displays: {},
        low_stock_alert: {},
        cookie_notice: {},
        growth_alert: {},
        live_visitors: {},
        sale_announcement: {},
        customize: {},
        type: prevState.settings.type,
        ...templateSettings,
      },
      activeTab: prevState.settings.type,
    }));
  };

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

  // The builder page doesn't need to be wrapped in our <Layout> because
  // it's not a full page, but rather rendered inside a WordPress meta box.
  // So the return statement is very simple.
  return (
    <div>
      {renderWizardStep()}
      <textarea
        id="surftrust_settings_field"
        name="_surftrust_settings"
        style={{ display: "none" }}
        key={initialSettings.id || "new"}
        defaultValue={JSON.stringify(builderState.settings)}
      />
    </div>
  );
};

export default Builder;
