import React, { useState } from "react";
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import SalesNotificationPanel from "./components/SalesNotificationPanel/SalesNotificationPanel";
import StockNotificationPanel from "./components/StockNotificationPanel/StockNotificationPanel";
import ReviewNotificationPanel from "./components/ReviewNotificationPanel/ReviewNotificationPanel";

const App = () => {
  // useState is a React Hook. It lets us add state to our component.
  // 'activeTab' is our state variable.
  // 'setActiveTab' is the function we use to update it.
  const [activeTab, setActiveTab] = useState("Sales Notifications");

  // This function will render the correct settings panel based on the activeTab state.
  const renderActivePanel = () => {
    switch (activeTab) {
      case "Low Stock Alerts":
        return <StockNotificationPanel />;
      case "Review Displays":
        return <ReviewNotificationPanel />;
      case "Sales Notifications":
      default:
        return <SalesNotificationPanel />;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Header />
      <TabNavigation activeTab={activeTab} onTabClick={setActiveTab} />
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#fff",
          border: "1px solid #ccd0d4",
        }}
      >
        {renderActivePanel()}
      </div>
    </div>
  );
};

export default App;
