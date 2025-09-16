// /src-jsx/components/SidebarNav.js
import React from "react";

// Using WordPress Dashicons for a native feel
const navItems = [
  {
    slug: "sales_notification",
    title: "Sales Notifications",
    icon: "dashicons-chart-line",
  },
  {
    slug: "low_stock_alert",
    title: "Low Stock Alerts",
    icon: "dashicons-warning",
  },
  {
    slug: "review_displays",
    title: "Review Displays",
    icon: "dashicons-star-filled",
  },
];

const SidebarNav = ({ activeTab, onTabClick }) => {
  return (
    <nav className="surftrust-sidebar-nav">
      <ul>
        {navItems.map((item) => (
          <li key={item.slug}>
            <a
              href="#"
              className={activeTab === item.slug ? "is-active" : ""}
              onClick={(e) => {
                e.preventDefault();
                onTabClick(item.slug);
              }}
            >
              <span className={`dashicons ${item.icon}`}></span>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
