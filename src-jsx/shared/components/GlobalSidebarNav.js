// /src-jsx/shared/components/GlobalSidebarNav.js
import React from "react";
// --- 1. Import Link and useLocation ---
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/dashboard", title: "Dashboard", icon: "dashicons-dashboard" },
  {
    path: "/all-notifications",
    title: "All Notifications",
    icon: "dashicons-menu-alt",
  },
  // This is now an internal route, not a direct PHP link
  { path: "/builder/new", title: "Add New", icon: "dashicons-plus" },
  { path: "/settings", title: "Settings", icon: "dashicons-admin-settings" },
  { path: "/analytics", title: "Analytics", icon: "dashicons-chart-area" },
];

const GlobalSidebarNav = () => {
  // --- 2. Use the useLocation hook to find the current path ---
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="surftrust-sidebar-nav">
      <ul>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <li key={item.path}>
              {/* --- 3. Use the Link component --- */}
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
