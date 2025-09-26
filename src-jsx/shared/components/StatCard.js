// /src-jsx/shared/components/StatCard.js
import React from "react";

const StatCard = ({ icon, value, label }) => {
  return (
    <div className="surftrust-stat-card">
      <span className={`dashicons ${icon}`}></span>
      <div>
        <div className="surftrust-stat-card-value">{value}</div>
        <div className="surftrust-stat-card-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
