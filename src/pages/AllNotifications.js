// /src-jsx/pages/AllNotifications.js

import React, { useState } from "react";
import FilterTabs from "./all-notifications/components/FilterTabs";
import SearchBar from "./all-notifications/components/SearchBar";
import NotificationsTable from "./all-notifications/components/NotificationsTable"; // Import our new component

const AllNotifications = () => {
  // State for our filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "surftrust-all-notifications-header"
  }, /*#__PURE__*/React.createElement("h1", null, "Notifications"), /*#__PURE__*/React.createElement("a", {
    href: "post-new.php?post_type=st_notification",
    className: "page-title-action"
  }, "Add New Notification")), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-filters"
  }, /*#__PURE__*/React.createElement(FilterTabs, {
    activeFilter: statusFilter,
    onFilterChange: setStatusFilter
  }), /*#__PURE__*/React.createElement(SearchBar, {
    searchQuery: searchQuery,
    onSearch: setSearchQuery
  })), /*#__PURE__*/React.createElement(NotificationsTable, {
    mode: "full",
    status: statusFilter,
    search: searchQuery
  }));
};
export default AllNotifications;