import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function transformKeys(raw) {
  return {
    ...raw,
    experiences: raw.expereince || raw.experiences || [],
  };
}

function extractMissingFields(profile) {
  const fields = [
    "phone", "address", "jobTitle", "aboutMe", "shortIntro",
    "skills", "experiences", "education", "projects", "languages"
  ];

  const missing = {};

  fields.forEach((key) => {
    const val = profile[key];
    const isEmpty =
      val === undefined || val === null ||
      (typeof val === "string" && val.trim() === "") ||
      (Array.isArray(val) && val.length === 0);

    if (isEmpty) {
      missing[key] = null;
    }
  });

  return missing;
}

export const generateMissingCVFields = async (rawProfile) => {
  const transformed = transformKeys(rawProfile);
  const missingFields = extractMissingFields(transformed);

  const prompt = `
You are a smart CV assistant.

Below is a user's profile with some fields missing (null, "", or empty array []).
Please generate content ONLY for those fields. DO NOT modify anything else.

Missing profile parts:
${JSON.stringify(missingFields, null, 2)}

Return a valid JSON object like:
{
  "aboutMe": "...",
  "shortIntro": "...",
  "skills": ["..."],
  ...
}

NO markdown, no explanation, only raw JSON.
`;

  try {
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let fullText = "";
    for await (const chunk of result.stream) {
      fullText += chunk.text();
    }

    const match = fullText.match(/```(?:json)?([\s\S]*?)```/);
    const jsonText = match ? match[1].trim() : fullText.trim();

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("❌ Failed to generate missing fields:", error);
    throw new Error("AI failed to suggest missing CV fields");
  }
};

export const evaluateCVScore = async (cvText) => {
  const prompt = `
Bạn là một chuyên gia tuyển dụng trong ngành CNTT.

Hãy đọc nội dung CV dưới đây và chấm điểm tổng quan từ 1 đến 10, đồng thời phân tích & góp ý theo các tiêu chí sau:

---

1. Cấu trúc và trình bày:
- CV có chia mục rõ ràng, dễ đọc, không lỗi chính tả?

2. Thông tin cá nhân và học vấn:
- Đầy đủ email/sđt, học vấn chi tiết, có thành tích?

3. Kỹ năng và kinh nghiệm:
- Nêu rõ kỹ năng chuyên môn, vai trò trong dự án, có kết quả cụ thể?

4. Mức độ chuyên nghiệp:
- Có mục tiêu nghề nghiệp, email nghiêm túc, định dạng chuẩn?

5. Điểm nổi bật:
- Có link GitHub/Portfolio, dự án tốt, thành tích đáng khen?

---

Nội dung CV (text thuần):
"""
${cvText}
"""

Hãy trả về một JSON object như sau, KHÔNG markdown/code block, KHÔNG giải thích ngoài lề:

{
  "score": 1-10,
  "feedback": "nhận xét tổng thể",
  "suggestions": ["gợi ý cải thiện 1", "gợi ý cải thiện 2", "gợi ý cải thiện 3"],
  "highlights": ["điểm mạnh 1", "điểm mạnh 2"]
}
`;

  try {
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let fullText = "";
    for await (const chunk of result.stream) {
      fullText += chunk.text();
    }

    const match = fullText.match(/```(?:json)?([\s\S]*?)```/);
    const jsonText = match ? match[1].trim() : fullText.trim();

    return JSON.parse(jsonText);
  } catch (err) {
    console.error("❌ Lỗi chấm điểm CV:", err);
    return {
      score: 0,
      feedback: "Đã xảy ra lỗi khi chấm điểm CV.",
      suggestions: [],
      highlights: []
    };
  }
};
