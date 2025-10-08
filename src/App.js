// /src-jsx/App.js
import React, { Suspense } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./shared/components/Layout";
import { Spinner } from "@wordpress/components";

// Lazy-load each "page" component.
// Webpack will automatically create a separate .js file for each of these.
const Dashboard = /*#__PURE__*/React.lazy(() => import("./pages/Dashboard"));
const AllNotifications = /*#__PURE__*/React.lazy(() => import("./pages/AllNotifications"));
const Settings = /*#__PURE__*/React.lazy(() => import("./pages/Settings"));
const Analytics = /*#__PURE__*/React.lazy(() => import("./pages/Analytics"));
const Builder = /*#__PURE__*/React.lazy(() => import("./pages/Builder"));

// A simple component to display a spinner while pages are loading.
const LoadingFallback = () => /*#__PURE__*/React.createElement("div", {
  className: "surftrust-loading-container"
}, /*#__PURE__*/React.createElement(Spinner, null));
const App = () => {
  return (
    /*#__PURE__*/
    // We use HashRouter because it's the most reliable for WordPress admin pages.
    React.createElement(HashRouter, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Suspense, {
      fallback: /*#__PURE__*/React.createElement(LoadingFallback, null)
    }, /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
      path: "/dashboard",
      element: /*#__PURE__*/React.createElement(Dashboard, null)
    }), /*#__PURE__*/React.createElement(Route, {
      path: "/all-notifications",
      element: /*#__PURE__*/React.createElement(AllNotifications, null)
    }), /*#__PURE__*/React.createElement(Route, {
      path: "/settings",
      element: /*#__PURE__*/React.createElement(Settings, null)
    }), /*#__PURE__*/React.createElement(Route, {
      path: "/analytics",
      element: /*#__PURE__*/React.createElement(Analytics, null)
    }), /*#__PURE__*/React.createElement(Route, {
      path: "/builder/new",
      element: /*#__PURE__*/React.createElement(Builder, null)
    }), /*#__PURE__*/React.createElement(Route, {
      path: "/builder/edit/:postId",
      element: /*#__PURE__*/React.createElement(Builder, null)
    }), /*#__PURE__*/React.createElement(Route, {
      path: "*",
      element: /*#__PURE__*/React.createElement(Navigate, {
        to: "/dashboard",
        replace: true
      })
    })))))
  );
};
export default App;