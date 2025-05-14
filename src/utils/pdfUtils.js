// utils/pdfUtils.js
import { jsPDF } from "jspdf";

export const generatePDF = (cvData) => {
  const doc = new jsPDF();

  // Add CV content to the PDF
  doc.text("CV - " + cvData.name, 20, 20);
  doc.text("Email: " + cvData.email, 20, 30);
  doc.text("Phone: " + cvData.phone, 20, 40);
  doc.text("Skills: " + `${cvData.skill1}, ${cvData.skill2}, ${cvData.skill3}`, 20, 50);
  doc.text("Experience: " + cvData.experience, 20, 60);
  doc.text("Education: " + cvData.education, 20, 70);
  doc.text("Goal: " + cvData.goal, 20, 80);

  // Save the PDF
  doc.save("cv_download.pdf");
};
