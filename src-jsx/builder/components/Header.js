// /src-jsx/settings/components/Header.js

import React from "react";

// 1. Add 'title' to the destructured props
const Header = ({ onSave, isSaving, title }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      {/* 2. Use the title prop, or fallback to a default */}
      <h1>{title || "Surftrust Settings"}</h1>
      <button
        className="button button-primary"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </header>
  );
};

export default Header;
