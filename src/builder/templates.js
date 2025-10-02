// /src-jsx/builder/templates.js

// --- NEW: Define Base Themes ---
export const baseThemes = {
  light: {
    name: "Minimalist Light",
    settings: {
      customize: {
        background_color: "#ffffff",
        font_color: "#333333",
        border_radius: 4,
        enable_shadow: true,
        font_family: "sans-serif"
      }
    }
  },
  dark: {
    name: "Modern Dark",
    settings: {
      customize: {
        background_color: "#2d3436",
        font_color: "#ffffff",
        border_radius: 8,
        enable_shadow: false,
        font_family: "sans-serif"
      }
    }
  },
  blue: {
    name: "Trust Blue",
    settings: {
      customize: {
        background_color: "#e8f4fd",
        font_color: "#1e88e5",
        border_radius: 6,
        enable_shadow: true,
        font_family: "sans-serif"
      }
    }
  },
  orange: {
    name: "Urgent Orange",
    settings: {
      customize: {
        background_color: "#fff3e0",
        font_color: "#e65100",
        border_radius: 6,
        enable_shadow: true,
        font_family: "serif"
      }
    }
  }
};

// --- MODIFIED: Define Notification Type-Specific Defaults/Templates ---
// These now define the content/logic part of a template, which can be combined with a baseTheme.
export const notificationTypeDefaults = {
  sale: [{
    id: "sale-default",
    name: "Standard Sale Pop-up",
    settings: {
      sales_notification: {
        message: "{first_name} in {city} just purchased {product_name}!"
      }
    }
  }],
  review: [{
    id: "review-default",
    name: "Standard Review Pop-up",
    settings: {
      review_displays: {
        min_rating: 4
      }
    }
  }],
  stock: [{
    id: "stock-default",
    name: "Standard Stock Alert",
    settings: {
      low_stock_alert: {
        threshold: 5
      }
    }
  }]
};