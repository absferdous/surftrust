// /src-jsx/shared/components/Layout.js
import React from "react";
import GlobalSidebarNav from "./GlobalSidebarNav";

const Layout = ({ children }) => {
  return (
    <div className="surftrust-app-wrapper">
      <GlobalSidebarNav />
      <main className="surftrust-main-content">{children}</main>
    </div>
  );
};

export default Layout;
