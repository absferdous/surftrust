// /src-jsx/builder/components/SaleAnnouncementPanel.js
import React from "react";
import { TextareaControl } from "@wordpress/components";
import DisplayRules from "./DisplayRules";
import SaveButton from "../../shared/components/SaveButton";

const SaleAnnouncementPanel = ({ settings, updateSetting }) => {
  if (!settings) {
    return null;
  }

  return (
    <div className="surftrust-panel">
      <hr />
      <TextareaControl
        label="Notification Message"
        help="Use placeholders like {product_name}, {sale_price}, {regular_price}, {discount_percentage}%, and {countdown_timer}."
        value={settings.message}
        onChange={(value) =>
          updateSetting("sale_announcement", "message", value)
        }
        rows={4}
      />
      {/* We will add targeting and urgency controls here later */}
      <DisplayRules
        settings={settings.display_rules || {}}
        updateSetting={updateSetting}
      />
      <SaveButton />
    </div>
  );
};

export default SaleAnnouncementPanel;
