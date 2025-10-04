// /src-jsx/builder/components/SaleAnnouncementPanel.js
import React from 'react';
import { TextareaControl } from '@wordpress/components';

const SaleAnnouncementPanel = ({ settings, updateSetting }) => {
    if (!settings) { return null; }

    return (
        <div className="surftrust-panel">
            <h2>Sale Announcement Settings</h2>
            <p>Configure the content of your sale announcement pop-up.</p>
            <hr />
            <TextareaControl
                label="Notification Message"
                help="Use placeholders like {product_name}, {sale_price}, {regular_price}, {discount_percentage}%, and {countdown_timer}."
                value={settings.message}
                onChange={(value) => updateSetting('sale_announcement', 'message', value)}
                rows={4}
            />
            {/* We will add targeting and urgency controls here later */}
        </div>
    );
};

export default SaleAnnouncementPanel;