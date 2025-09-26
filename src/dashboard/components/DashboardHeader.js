// /src-jsx/dashboard/components/DashboardHeader.js
import React from "react";
const DashboardHeader = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-dashboard-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Welcome to Surftrust"), /*#__PURE__*/React.createElement("p", null, "Here's a snapshot of your notification performance.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "post-new.php?post_type=st_notification",
    className: "button button-primary button-hero"
  }, "+ Add New Notification")));
};
export default DashboardHeader;