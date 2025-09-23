// /src-jsx/components/Header.js

import React from "react";

// We now receive props: onSave function and isSaving state.
const Header = ({ onSave, isSaving }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h1>Surftrust Settings</h1>
      <button
        className="button button-primary"
        onClick={onSave} // Call the passed-in onSave function when clicked
        disabled={isSaving} // Disable the button while saving
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </header>
  );
};

export default Header;
