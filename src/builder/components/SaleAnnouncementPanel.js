// /src-jsx/builder/components/SaleAnnouncementPanel.js
import React from 'react';
import { TextareaControl } from '@wordpress/components';
const SaleAnnouncementPanel = ({
  settings,
  updateSetting
}) => {
  if (!settings) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "Sale Announcement Settings"), /*#__PURE__*/React.createElement("p", null, "Configure the content of your sale announcement pop-up."), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(TextareaControl, {
    label: "Notification Message",
    help: "Use placeholders like {product_name}, {sale_price}, {regular_price}, {discount_percentage}%, and {countdown_timer}.",
    value: settings.message,
    onChange: value => updateSetting('sale_announcement', 'message', value),
    rows: 4
  }));
};
export default SaleAnnouncementPanel;