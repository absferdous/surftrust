// /src-jsx/builder/components/ChooseType.js
import React from "react";

const notificationTypes = [
  {
    slug: "sale",
    title: "Sales Notification",
    description: "Display recent sales to create social proof and urgency.",
    icon: "dashicons-cart",
  },
  {
    slug: "review",
    title: "Review Display",
    description: "Showcase positive customer reviews to build trust.",
    icon: "dashicons-star-filled",
  },
  {
    slug: "stock",
    title: "Low Stock Alert",
    description: "Notify customers when inventory is running low.",
    icon: "dashicons-warning",
  },
  {
    slug: "cookie_notice",
    title: "Cookie Notice",
    description: "Display a cookie consent notice for GDPR/CCPA compliance.",
    icon: "dashicons-info",
  },
  {
    slug: "growth_alert",
    title: "Growth Alert (Social Share)",
    description: "Encourage visitors to share your content on social media.",
    icon: "dashicons-share",
  },
  {
    slug: "live_visitors",
    title: "Live Visitor Count",
    description:
      "Show how many people are currently browsing your site to build buzz.",
    icon: "dashicons-groups",
  },

  {
    slug: "sale_announcement",
    title: "Sale Announcement",
    description:
      "Promote products that are currently on sale to drive traffic.",
    icon: "dashicons-megaphone",
  },
];

const ChooseType = ({ onSelectType }) => {
  return (
    <div>
      <h2 className="surftrust-wizard-header">
        What type of notification would you like to create?
      </h2>
      <div className="surftrust-type-grid">
        {notificationTypes.map((type) => (
          <div
            key={type.slug}
            className="surftrust-type-card"
            onClick={() => onSelectType(type.slug)}
          >
            <span className={`dashicons ${type.icon}`}></span>
            <h3>{type.title}</h3>
            <p>{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseType;
