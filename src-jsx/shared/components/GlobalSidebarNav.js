// /src-jsx/shared/components/GlobalSidebarNav.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

// --- 1. Modify the navItems array ---
// We now read the 'Add New' URL from the global object we created in PHP.
const navItems = [
  { path: "/dashboard", title: "Dashboard", icon: "dashicons-dashboard" },
  {
    path: "/all-notifications",
    title: "All Notifications",
    icon: "dashicons-menu-alt",
  },
  // This is now an external link, not an internal SPA route.
  {
    path: window.surftrust_admin_data.add_new_url,
    title: "Add New",
    icon: "dashicons-plus",
    isExternal: true, // Add a flag to identify this as an external link
  },
  { path: "/settings", title: "Settings", icon: "dashicons-admin-settings" },
  { path: "/analytics", title: "Analytics", icon: "dashicons-chart-area" },
];

const GlobalSidebarNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="surftrust-sidebar-nav">
      <ul>
        {navItems.map((item) => {
          // --- 2. Conditionally render either a <Link> or an <a> tag ---
          if (item.isExternal) {
            return (
              <li key={item.path}>
                <a href={item.path}>
                  <span className={`dashicons ${item.icon}`}></span>
                  {item.title}
                </a>
              </li>
            );
          }

          // This is the original logic for internal SPA links
          const isActive = currentPath === item.path;
          return (
            <li key={item.path}>
              <Link to={item.path} className={isActive ? "is-active" : ""}>
                <span className={`dashicons ${item.icon}`}></span>
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <div
        style={{
          marginTop: "auto",
          paddingTop: "20px",
          borderTop: "1px solid #dcdcde",
        }}
      >
        <a href="index.php">
          <span className="dashicons dashicons-arrow-left-alt"></span>
          Back to WP Dashboard
        </a>
      </div>
    </nav>
  );
};

export default GlobalSidebarNav;
