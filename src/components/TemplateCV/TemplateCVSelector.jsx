"use client";

import React, { useState } from "react";

export default function TemplateSelector({ onSelectTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const templates = [
    { name: "Template 1", description: "Clean and simple design" },
    { name: "Template 2", description: "Modern and stylish" },
    { name: "Template 3", description: "Professional and detailed" },
  ];

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    onSelectTemplate(template); // Gửi template đã chọn lên component cha
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Choose a CV Template</h2>
      {templates.map((template, index) => (
        <div
          key={index}
          className={`border p-4 rounded-lg cursor-pointer ${
            selectedTemplate === template.name ? "bg-blue-200" : "bg-gray-100"
          }`}
          onClick={() => handleSelectTemplate(template.name)}
        >
          <h3 className="text-lg font-medium">{template.name}</h3>
          <p className="text-sm">{template.description}</p>
        </div>
      ))}
    </div>
  );
}
