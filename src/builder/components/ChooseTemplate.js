// /src-jsx/builder/components/ChooseTemplate.js
import React, { useState } from "react";
import { baseThemes, notificationTypeDefaults } from "../templates"; // Import our new data structure

// --- Helper function to simulate rendering a notification (for preview) ---
const renderPreviewNotification = (themeSettings, layoutStyle, notificationType, sampleData) => {
  // This function needs to be a simplified version of public.js's render/apply styles.
  // For now, it will return a string for visual inspection.

  const combinedCustomize = {
    ...themeSettings.customize,
    layout_style: layoutStyle
  };
  const bgColor = combinedCustomize.background_color || "#fff";
  const textColor = combinedCustomize.font_color || "#000";
  const borderRadius = combinedCustomize.border_radius || 4;
  let message = "";
  switch (notificationType) {
    case "sale":
      message = `${sampleData.customer_name} just purchased ${sampleData.product_name}`;
      break;
    case "review":
      message = `${sampleData.reviewer_name} left a ${sampleData.rating}-star review`;
      break;
    case "stock":
      message = `Only ${sampleData.stock_count} of ${sampleData.product_name} left!`;
      break;
    default:
      message = "A notification preview";
  }
  let imageHtml = "";
  if (layoutStyle !== "bar") {
    // --- THIS IS THE CHANGE ---
    // We get the base URL of our plugin from the global object.
    const pluginUrl = window.surftrust_admin_data.plugin_url || "../";
    const iconUrl = `${pluginUrl}public/images/avatar-1.svg`;

    // Create an <img> tag.
    imageHtml = `<img src="${iconUrl}" alt="Avatar" style="width: 40px; height: 40px; border-radius: 50%;" />`;
  }
  const wrapperStyle = {
    background: bgColor,
    color: textColor,
    borderRadius: `${borderRadius}px`,
    padding: "10px 15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "200px",
    maxWidth: "300px",
    fontSize: "14px",
    boxShadow: combinedCustomize.enable_shadow ? "0 2px 10px rgba(0,0,0,0.1)" : "none"
  };
  // Use a div and the dangerouslySetInnerHTML prop to render our HTML string
  const imagePreview = imageHtml ? /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: imageHtml
    }
  }) : null;

  // Basic layout styles
  switch (layoutStyle) {
    case "bubble":
      wrapperStyle.borderRadius = "50px";
      if (imageHtml) imageHtml = `<div style="width:30px;height:30px;background:#eee;border-radius:50%;border:2px solid ${bgColor};"></div>`;
      break;
    case "bar":
      wrapperStyle.width = "100%";
      wrapperStyle.borderRadius = "0";
      wrapperStyle.justifyContent = "center";
      imageHtml = ""; // Ensure no image for bar
      break;
  }
  return /*#__PURE__*/React.createElement("div", {
    style: wrapperStyle
  }, imagePreview, /*#__PURE__*/React.createElement("div", null, message));
};

// Sample data for the preview
const sampleNotificationData = {
  customer_name: "John D.",
  product_name: "NotificationX Pro",
  city: "New York",
  time_ago: "1 minute ago",
  reviewer_name: "Emily S.",
  rating: 5,
  stock_count: 3
};
const ChooseTemplate = ({
  notificationType,
  onSelectTemplate,
  onGoBack
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState("light"); // Default selected theme
  const [selectedLayout, setSelectedLayout] = useState("card"); // Default selected layout

  const selectedTheme = baseThemes[selectedThemeId];
  const notificationDefaults = notificationTypeDefaults[notificationType][0]; // Assuming only one default for now
  console.log("ChooseTemplate is building finalSettings. notificationDefaults.settings is:", notificationDefaults.settings);
  // Combine base theme settings with layout settings and notification defaults
  const finalSettings = {
    type: notificationType,
    ...notificationDefaults.settings,
    // e.g. { sales_notification: { message: ... } }
    customize: {
      ...selectedTheme.settings.customize,
      layout_style: selectedLayout
    }
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "surftrust-wizard-navigation"
  }, /*#__PURE__*/React.createElement("button", {
    className: "surftrust-wizard-back-button",
    onClick: onGoBack
  }, /*#__PURE__*/React.createElement("span", {
    className: "dashicons dashicons-arrow-left-alt2"
  }), "Back to Type Selection")), /*#__PURE__*/React.createElement("h2", {
    className: "surftrust-wizard-header"
  }, "Choose a Theme & Layout"), /*#__PURE__*/React.createElement("h3", null, "1. Select a Theme (Colors & Fonts)"), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-type-grid",
    style: {
      marginBottom: "40px"
    }
  }, Object.entries(baseThemes).map(([id, theme]) => /*#__PURE__*/React.createElement("div", {
    key: id,
    className: `surftrust-type-card ${selectedThemeId === id ? "is-active" : ""}`,
    onClick: () => setSelectedThemeId(id),
    style: {
      borderColor: selectedThemeId === id ? "#2271b1" : "#ccd0d4"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0
    }
  }, theme.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "5px",
      justifyContent: "center",
      marginTop: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "20px",
      height: "20px",
      background: theme.settings.customize.background_color,
      border: "1px solid #ccc",
      borderRadius: "3px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "20px",
      height: "20px",
      background: theme.settings.customize.font_color,
      border: "1px solid #ccc",
      borderRadius: "3px"
    }
  }))))), /*#__PURE__*/React.createElement("h3", null, "2. Select a Pop-up Layout Style"), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-type-grid",
    style: {
      marginBottom: "40px"
    }
  }, [{
    id: "card",
    name: "Card"
  }, {
    id: "bubble",
    name: "Bubble"
  }, {
    id: "bar",
    name: "Top Bar"
  }].map(layout => /*#__PURE__*/React.createElement("div", {
    key: layout.id,
    className: `surftrust-type-card ${selectedLayout === layout.id ? "is-active" : ""}`,
    onClick: () => setSelectedLayout(layout.id),
    style: {
      borderColor: selectedLayout === layout.id ? "#2271b1" : "#ccd0d4"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0
    }
  }, layout.name), /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "scale(0.8)",
      transformOrigin: "center top",
      marginTop: "15px"
    }
  }, renderPreviewNotification(selectedTheme.settings, layout.id, notificationType, sampleNotificationData))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: "30px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "button button-primary button-hero",
    onClick: () => onSelectTemplate(finalSettings)
  }, "Use Selected Layout & Theme")));
};
export default ChooseTemplate;