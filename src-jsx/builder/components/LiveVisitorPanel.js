// /src-jsx/builder/components/LiveVisitorPanel.js
import React from "react";
import { TextareaControl } from "@wordpress/components";
import DisplayRules from "./DisplayRules";

const LiveVisitorPanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return null;
  }

  return (
    <div className="surftrust-panel">
      <h2>Live Visitor Count Settings</h2>
      <p>
        Display a pop-up showing the number of current visitors on your site.
      </p>
      <hr />
      <TextareaControl
        label="Notification Message"
        help="Customize the message. Use {count} as a placeholder for the number of live visitors."
        value={settings.message}
        onChange={(value) => updateSetting("live_visitors", "message", value)}
      />
      <DisplayRules
        settingsGroupName="live_visitors"
        settings={settings.display_rules || {}}
        updateSetting={updateSetting}
      />
    </div>
  );
};

export default LiveVisitorPanel;
