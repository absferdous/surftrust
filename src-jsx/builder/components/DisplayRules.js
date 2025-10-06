// /src-jsx/builder/components/DisplayRules.js
import React from "react";
import PostSelector from "./PostSelector"; // Make sure this path is correct

const DisplayRules = ({ settingsGroupName, settings, updateSetting }) => {
  const handleShowOnChange = (selectedPosts) => {
    updateSetting(settingsGroupName, "display_rules", {
      ...settings,
      show_on: selectedPosts, // selectedPosts is now an array of {id, title} objects
    });
  };

  const handleHideOnChange = (selectedPosts) => {
    updateSetting(settingsGroupName, "display_rules", {
      ...settings,
      hide_on: selectedPosts,
    });
  };

  return (
    <div>
      <hr />
      <h3>Display Rules</h3>
      <p>
        Leave both blank to show on all pages. Start typing to search for posts,
        pages, or products.
      </p>

      <PostSelector
        label="Show ONLY on these pages:"
        value={settings.show_on || []}
        onChange={handleShowOnChange}
      />

      <PostSelector
        label="Hide on these pages:"
        value={settings.hide_on || []}
        onChange={handleHideOnChange}
      />
    </div>
  );
};

export default DisplayRules;
