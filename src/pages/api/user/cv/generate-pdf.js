import { jsPDF } from "jspdf";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { cvData } = req.body;

  if (!cvData) {
    return res.status(400).json({ success: false, message: "Missing CV data" });
  }

  try {
    const doc = new jsPDF();

    // Thêm nội dung vào PDF
    doc.text("CV - " + cvData.name, 20, 20);
    doc.text("Email: " + cvData.email, 20, 30);
    doc.text("Phone: " + cvData.phone, 20, 40);
    doc.text("Skills: " + `${cvData.skills}`, 20, 50);
    doc.text("Experience: " + `${cvData.experience}`, 20, 60);
    doc.text("Education: " + `${cvData.education}`, 20, 70);
    doc.text("Objective: " + `${cvData.objective}`, 20, 80);

    // Save the PDF as a Blob and return a URL
    const pdfBlob = doc.output("blob");

    // Convert Blob to Base64 URL
    const fileUrl = URL.createObjectURL(pdfBlob);

    return res.status(200).json({
      success: true,
      url: fileUrl, // Return the generated PDF URL
    });
  } catch (err) {
    console.error("Error generating PDF:", err);
    return res.status(500).json({
      success: false,
      message: "Error generating PDF",
    });
  }
}
