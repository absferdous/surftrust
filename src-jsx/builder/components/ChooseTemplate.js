// /src-jsx/builder/components/ChooseTemplate.js
import React from "react";
import { templates } from "../templates"; // Import our new templates

const templateBoxStyle = {
  border: "1px solid #ccd0d4",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  background: "#fff",
  transition: "all 0.2s ease-in-out",
};

const ChooseTemplate = ({ notificationType, onSelectTemplate }) => {
  const availableTemplates = templates[notificationType] || [];

  return (
    <div>
      <h2
        style={{ textAlign: "center", fontSize: "24px", margin: "20px 0 40px" }}
      >
        Choose a Template
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {availableTemplates.map((template) => (
          <div
            key={template.id}
            style={templateBoxStyle}
            onClick={() => onSelectTemplate(template.settings)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#2271b1")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#ccd0d4")
            }
          >
            <h3 style={{ fontSize: "18px", margin: "0" }}>{template.name}</h3>
            {/* We could add thumbnail previews here later */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseTemplate;
