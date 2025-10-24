// /src-jsx/all-notifications/components/SearchBar.js
import React from "react";
import { TextControl } from "@wordpress/components";

const SearchBar = ({ searchQuery, onSearch }) => {
  return (
    <div className="surftrust-search-bar" style={{ width: "250px" }}>
      <TextControl
        placeholder="Search Notifications..."
        value={searchQuery}
        onChange={onSearch}
      />
    </div>
  );
};

export default SearchBar;
