// /src-jsx/shared/components/SaveButton.js

import React, { useState, useEffect } from "react";
import { Button } from "@wordpress/components";

const SaveButton = () => {
  const [isSaving, setIsSaving] = useState(false);

  // This effect runs when the component mounts
  useEffect(() => {
    // Find the main WordPress form
    const form = document.getElementById("post");
    if (!form) return;

    // Listen for the form's submit event
    const handleSubmit = () => {
      // When the REAL form submission starts, set our button to its saving state.
      setIsSaving(true);
    };

    form.addEventListener("submit", handleSubmit);

    // Cleanup function: remove the event listener when the component unmounts
    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, []); // Empty dependency array means this runs only once

  const handleSave = () => {
    // This function now ONLY has to click the main button.
    // The useEffect hook above will handle the state change.
    const publishButton = document.getElementById("publish");
    if (publishButton) {
      // Check if the button is already disabled to prevent double-clicks
      if (publishButton.disabled) {
        return;
      }
      publishButton.click();
    }
  };

  return (
    <div className="surftrust-save-button-wrapper">
      <Button
        className="surftrust-save-button"
        isPrimary
        // The isBusy prop is now controlled by the real form submission status
        isBusy={isSaving}
        // We can also disable it to prevent multiple clicks
        disabled={isSaving}
        onClick={handleSave}
      >
        {isSaving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
};

export default SaveButton;
