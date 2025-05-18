import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { PdfConverter } from "pdf-poppler";
import Tesseract from "tesseract.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Chuyển PDF thành ảnh PNG
async function convertPdfToImages(pdfBuffer, outputDir) {
  const tempPdfPath = path.join(outputDir, 'temp.pdf');
  fs.writeFileSync(tempPdfPath, pdfBuffer);

  const converter = new PdfConverter(tempPdfPath);
  await converter.convert({ format: 'png', out_dir: outputDir });

  const files = fs.readdirSync(outputDir)
    .filter((file) => file.endsWith('.png'))
    .sort();

  return files.map((file) => path.join(outputDir, file));
}

// OCR từ ảnh
async function ocrImages(imagePaths) {
  let fullText = "";

  for (const imagePath of imagePaths) {
    const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
    fullText += text + "\n";
  }

  return fullText;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { cvUrl } = req.body;
  if (!cvUrl) return res.status(400).json({ success: false, error: "Thiếu cvUrl" });

  try {
    // B1: Tải file PDF từ Supabase
    const response = await fetch(cvUrl);
    const buffer = await response.buffer();

    // B2: Parse PDF
    let cvText = "";
    try {
      const data = await pdfParse(buffer);
      cvText = data.text;
    } catch {
      console.warn("❌ pdf-parse thất bại, chuyển sang OCR");
    }

    // Nếu parse thất bại hoặc text quá ngắn → OCR
    if (!cvText || cvText.trim().length < 30) {
      const tempDir = path.join(process.cwd(), "tmp");
      fs.mkdirSync(tempDir, { recursive: true });

      const imagePaths = await convertPdfToImages(buffer, tempDir);
      cvText = await ocrImages(imagePaths);

      // Xoá file tạm
      imagePaths.forEach((img) => fs.unlinkSync(img));
      fs.unlinkSync(path.join(tempDir, "temp.pdf"));
    }

    if (!cvText || cvText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error: "CV không chứa nội dung có thể đọc được. Vui lòng thử file khác.",
      });
    }

    // B3: Gửi prompt đến Gemini
    const prompt = `
Bạn là chuyên gia tuyển dụng ngành CNTT. Hãy chấm điểm CV bên dưới dựa trên các tiêu chí:
1. Cấu trúc & trình bày
2. Học vấn, liên hệ
3. Kỹ năng, kinh nghiệm
4. Mức độ chuyên nghiệp
5. Điểm nổi bật

Nội dung CV:
"""
${cvText}
"""

Trả về duy nhất một JSON object:

{
  "score": 1-10,
  "feedback": "nhận xét tổng thể",
  "suggestions": ["...", "..."],
  "highlights": ["...", "..."]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const match = text.match(/```(?:json)?([\s\S]*?)```/);
    const jsonText = match ? match[1].trim() : text.trim();
    const parsed = JSON.parse(jsonText);

    return res.status(200).json({ success: true, ...parsed });
  } catch (err) {
    console.error("🔥 Lỗi evaluate-cv:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Lỗi server khi chấm điểm CV",
    });
  }
}