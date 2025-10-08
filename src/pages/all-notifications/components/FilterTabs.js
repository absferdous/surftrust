// /src-jsx/all-notifications/components/FilterTabs.js
import React from "react";
const FilterTabs = ({
  activeFilter,
  onFilterChange
}) => {
  const filters = [{
    slug: "all",
    label: "All"
  }, {
    slug: "publish",
    label: "Enabled"
  }, {
    slug: "draft",
    label: "Disabled"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-filter-tabs"
  }, filters.map(filter => /*#__PURE__*/React.createElement("button", {
    key: filter.slug,
    className: activeFilter === filter.slug ? "is-active" : "",
    onClick: () => onFilterChange(filter.slug)
  }, filter.label)));
};
export default FilterTabs;