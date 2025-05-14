import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Interview Practice Functions
export const generateQuestions = async (field, role, level, category, difficulty) => {
  const prompt = `You are an expert interviewer for ${field} industry, specifically for ${role} positions.
    Generate 5 ${difficulty} level interview questions appropriate for a ${level} ${role} position.
    The questions should be in the ${category} category.
    
    Your response MUST be a valid JSON that can be parsed by JSON.parse(). Do not include any markdown formatting, code blocks, or explanatory text.
    Return ONLY a JSON object with the following structure:
    {
      "questions": [
        {
          "question": "The detailed interview question",
          "idealAnswer": "A comprehensive model answer that would score 10/10",
          "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
          "expectedDuration": 15,
          "followUpQuestions": ["Follow-up question 1"],
          "skillsTested": ["Problem Solving", "Communication"]
        }
      ]
    }`;

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
    
    const parsedResponse = JSON.parse(jsonText);
    
    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
      throw new Error("Invalid response structure from AI");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};

export const evaluateAnswer = async (question, answer, context) => {
  const prompt = `You are an expert interviewer evaluating a candidate's answer.
    Question: ${question.question}
    Candidate's Answer: ${answer}
    Context: ${JSON.stringify(context)}
    
    Evaluate the answer and provide feedback in the following JSON format:
    {
      "score": number (0-10),
      "feedback": "Detailed feedback on the answer",
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "strongPoints": ["Strong point 1", "Strong point 2"],
      "missedConcepts": ["Missed concept 1", "Missed concept 2"],
      "overallEvaluation": "Overall evaluation of the answer"
    }`;

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
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return {
      score: 0,
      feedback: "An error occurred during evaluation. Please try again.",
      suggestions: ["Try again"],
      strongPoints: [],
      missedConcepts: [],
      overallEvaluation: "Evaluation failed due to a technical error."
    };
  }
};

// Job Analysis Functions
export const analyzeJobDescription = async (jobDescription, responsibilities, whoYouAre, niceToHaves) => {
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
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing job description:", error);
    throw new Error(`Failed to analyze job description: ${error.message}`);
  }
};

export const evaluateApplicant = async (jobInfo, applicantInfo) => {
  const prompt = `
    Đánh giá mức độ phù hợp của ứng viên với công việc dựa trên:
    Thông tin công việc: ${JSON.stringify(jobInfo)}
    Thông tin ứng viên: ${JSON.stringify(applicantInfo)}
    
    Trả về một JSON object với cấu trúc sau:
    {
      "score": số (1.0-5.0),
      "reason": "Giải thích chi tiết bằng tiếng Việt",
      "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
      "weaknesses": ["Điểm yếu 1", "Điểm yếu 2"],
      "recommendations": ["Đề xuất 1", "Đề xuất 2"]
    }`;

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
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error evaluating applicant:", error);
    throw new Error(`Failed to evaluate applicant: ${error.message}`);
  }
}; 