// /src-jsx/all-notifications/components/SearchBar.js
import React from "react";
import { TextControl } from "@wordpress/components";
const SearchBar = ({
  searchQuery,
  onSearch
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-search-bar",
    style: {
      width: "250px"
    }
  }, /*#__PURE__*/React.createElement(TextControl, {
    placeholder: "Search Notifications...",
    value: searchQuery,
    onChange: onSearch
  }));
};
export default SearchBar;