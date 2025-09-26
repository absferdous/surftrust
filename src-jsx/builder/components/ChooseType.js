// /src-jsx/builder/components/ChooseType.js
import React from "react";

const notificationTypes = [
  {
    slug: "sale",
    title: "Sales Notification",
    description: "Display recent sales to create social proof and urgency.",
    icon: "dashicons-cart",
  },
  {
    slug: "review",
    title: "Review Display",
    description: "Showcase positive customer reviews to build trust.",
    icon: "dashicons-star-filled",
  },
  {
    slug: "stock",
    title: "Low Stock Alert",
    description: "Notify customers when product inventory is running low.",
    icon: "dashicons-warning",
  },
];

// Basic CSS for our selection boxes - we'll use a little inline style for now
const typeBoxStyle = {
  border: "1px solid #ccd0d4",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  background: "#fff",
  transition: "all 0.2s ease-in-out",
};

const ChooseType = ({ onSelectType }) => {
  return (
    <div>
      <h2
        style={{ textAlign: "center", fontSize: "24px", margin: "20px 0 40px" }}
      >
        What type of notification would you like to create?
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {notificationTypes.map((type) => (
          <div
            key={type.slug}
            style={typeBoxStyle}
            onClick={() => onSelectType(type.slug)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#2271b1")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#ccd0d4")
            }
          >
            <span
              className={`dashicons ${type.icon}`}
              style={{ fontSize: "48px", marginBottom: "15px" }}
            ></span>
            <h3 style={{ fontSize: "18px", margin: "0 0 10px" }}>
              {type.title}
            </h3>
            <p style={{ margin: 0, color: "#555" }}>{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseType;
