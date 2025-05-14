import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { jobDescription, responsibilities, whoYouAre, niceToHaves } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Google API key is not configured" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Từ nội dung sau, hãy liệt kê các kỹ năng, kinh nghiệm, trình độ, kỹ năng mềm, nhận xét công việc... các yếu tố cần thiết cho để tạo việc.
    Trả về kết quả theo định dạng JSON với mỗi danh mục là một mảng. Ví dụ:
    {
      "Kỹ năng": [...],
      "Kinh nghiệm": [...],
      "Trình độ": [...],
      "Kỹ năng mềm": [...],
      "Yêu cầu": [...],
      "Trách nhiệm": [...],
      "Quyền lợi": [...]
    }
    Lưu ý: Bám sát nội dung đã gửi.
    Nội dung:
      Job Description: ${jobDescription}
      Responsibilities: ${responsibilities}
      Who You Are: ${whoYouAre}
      Nice to Haves: ${niceToHaves}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let jsonText = text;
    if (text.includes("```json")) {
      jsonText = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
      jsonText = text.split("```")[1].split("```")[0].trim();
    }
    
    res.status(200).json({ result: jsonText });
  } catch (error) {
    console.error("Lỗi Gemini:", error);
    res.status(500).json({ error: "Lỗi khi phân tích công việc" });
  }
}
