import React from "react";

const Header = () => {
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
      <button className="button button-primary">Save Changes</button>
    </header>
  );
};

export default Header;
