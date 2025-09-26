// /src-jsx/builder/templates.js

export const templates = {
  sale: [
    {
      id: "sale-light",
      name: "Minimalist Light",
      settings: {
        customize: {
          background_color: "#ffffff",
          font_color: "#333333",
          border_radius: 4,
          enable_shadow: true,
        },
        sales_notification: {
          message: "{first_name} in {city} just purchased {product_name}!",
        },
      },
    },
    {
      id: "sale-dark",
      name: "Modern Dark",
      settings: {
        customize: {
          background_color: "#2d3436",
          font_color: "#ffffff",
          border_radius: 8,
          enable_shadow: false,
        },
        sales_notification: {
          message: "🔥 {first_name} just snagged {product_name}!",
        },
      },
    },
  ],
  review: [
    {
      id: "review-light",
      name: "Simple & Clean",
      settings: {
        customize: { background_color: "#ffffff", font_color: "#333333" },
        review_displays: { min_rating: 4 },
      },
    },
    {
      id: "review-blue",
      name: "Trust Blue",
      settings: {
        customize: { background_color: "#e8f4fd", font_color: "#1e88e5" },
        review_displays: { min_rating: 4 },
      },
    },
  ],
  stock: [
    {
      id: "stock-warning",
      name: "Urgent Orange",
      settings: {
        customize: { background_color: "#fff3e0", font_color: "#e65100" },
        low_stock_alert: { threshold: 5 },
      },
    },
    {
      id: "stock-light",
      name: "Minimalist Alert",
      settings: {
        customize: { background_color: "#ffffff", font_color: "#333333" },
        low_stock_alert: { threshold: 10 },
      },
    },
  ],
};
