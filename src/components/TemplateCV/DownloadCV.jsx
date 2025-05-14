"use client";

import { jsPDF } from "jspdf";

export default function DownloadCV({ cvData }) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add CV content to the PDF
    doc.text("CV - " + cvData.name, 20, 20);
    doc.text("Email: " + cvData.email, 20, 30);
    doc.text("Phone: " + cvData.phone, 20, 40);
    doc.text("Skills: " + `${cvData.skills}`, 20, 50);
    doc.text("Experience: " + `${cvData.experience}`, 20, 60);
    doc.text("Education: " + `${cvData.education}`, 20, 70);
    doc.text("Objective: " + `${cvData.objective}`, 20, 80);

    // Save the PDF
    doc.save("cv_download.pdf");
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleDownloadPDF}
        className="bg-blue-600 text-white py-2 px-6 rounded-lg mt-4"
      >
        Download CV as PDF
      </button>
    </div>
  );
}
