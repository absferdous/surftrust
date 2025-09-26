// /src-jsx/builder/components/ChooseTemplate.js
import React from "react";
import { templates } from "../templates"; // Import our new templates

const templateBoxStyle = {
  border: "1px solid #ccd0d4",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  background: "#fff",
  transition: "all 0.2s ease-in-out"
};
const ChooseTemplate = ({
  notificationType,
  onSelectTemplate
}) => {
  const availableTemplates = templates[notificationType] || [];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: "center",
      fontSize: "24px",
      margin: "20px 0 40px"
    }
  }, "Choose a Template"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px"
    }
  }, availableTemplates.map(template => /*#__PURE__*/React.createElement("div", {
    key: template.id,
    style: templateBoxStyle,
    onClick: () => onSelectTemplate(template.settings),
    onMouseEnter: e => e.currentTarget.style.borderColor = "#2271b1",
    onMouseLeave: e => e.currentTarget.style.borderColor = "#ccd0d4"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "18px",
      margin: "0"
    }
  }, template.name)))));
};
export default ChooseTemplate;