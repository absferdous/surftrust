// /src-jsx/shared/components/StatCard.js
import React from "react";
const StatCard = ({
  icon,
  value,
  label
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "surftrust-stat-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: `dashicons ${icon}`
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "surftrust-stat-card-value"
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "surftrust-stat-card-label"
  }, label)));
};
export default StatCard;