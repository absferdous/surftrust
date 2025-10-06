// /src-jsx/builder/components/CookieNoticePanel.js
import React from "react";
import { TextControl, TextareaControl } from "@wordpress/components";
import DisplayRules from "./DisplayRules";

const CookieNoticePanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return null;
  }

  return (
    <div className="surftrust-panel">
      <h2>Cookie Notice Settings</h2>
      <p>Configure the content of your cookie consent pop-up.</p>
      <hr />
      <TextareaControl
        label="Notice Message"
        help="The main text displayed to the user."
        value={settings.message}
        onChange={(value) => updateSetting("cookie_notice", "message", value)}
      />
      <TextControl
        label="Accept Button Text"
        value={settings.button_text}
        onChange={(value) =>
          updateSetting("cookie_notice", "button_text", value)
        }
      />
      <DisplayRules
        settingsGroupName="cookie_notice"
        settings={settings.display_rules || {}}
        updateSetting={updateSetting}
      />
    </div>
  );
};

export default CookieNoticePanel;
