import { getAIResponse, getOpenAIClient } from './azureAiService';

/**
 * Phân tích đoạn giới thiệu để trích xuất các chủ đề chính
 */
export const extractTopics = async (introduction) => {
  const prompt = `Hãy phân tích đoạn text sau và xác định xem đây có phải là lời giới thiệu bản thân và kinh nghiệm làm việc không. Nếu không phải, trả về JSON object với isIntroduction: false. Nếu đúng là giới thiệu, trả về JSON object với format:

  {
    "isIntroduction": boolean, // true nếu là lời giới thiệu, false nếu không
    "skills": string[], // Các kỹ năng kỹ thuật
    "experience": string[], // Các kinh nghiệm làm việc
    "projects": string[], // Các dự án đã làm
    "education": string[], // Thông tin học vấn
    "softSkills": string[] // Các kỹ năng mềm
  }

  Text cần phân tích:
  ${introduction}`;
  
  try {
    const response = await getAIResponse(prompt, [], {
      instruction: "Trả về kết quả dưới dạng JSON object với các trường như mô tả"
    });
    
    const result = JSON.parse(response);
    
    // Nếu không phải là lời giới thiệu, trả về mảng rỗng
    if (!result.isIntroduction) {
      return [];
    }

    // Kết hợp tất cả các chủ đề thành một mảng duy nhất
    const allTopics = [
      ...(result.skills || []),
      ...(result.experience || []),
      ...(result.projects || []),
      ...(result.education || []),
      ...(result.softSkills || [])
    ];

    // Loại bỏ các chủ đề trùng lặp
    const uniqueTopics = [...new Set(allTopics)];
    
    return uniqueTopics;
  } catch (error) {
    console.error('Error extracting topics:', error);
    return [];
  }
};

/**
 * Tạo danh sách câu hỏi cho một chủ đề
 */
export const generateQuestionsForTopic = async (topic) => {
  const systemPromptForQuestionGeneration = `Bạn là một chuyên gia phỏng vấn kỹ thuật. Nhiệm vụ của bạn là tạo ra 5 câu hỏi phỏng vấn về chủ đề "${topic}". 

  Yêu cầu:
  1. Câu hỏi đầu tiên nên là câu hỏi cơ bản để đánh giá kiến thức nền tảng
  2. Câu hỏi thứ hai nên tập trung vào kinh nghiệm thực tế
  3. Câu hỏi thứ ba nên là tình huống thực tế hoặc case study
  4. Câu hỏi thứ tư nên đánh giá khả năng giải quyết vấn đề
  5. Câu hỏi cuối cùng nên là câu hỏi nâng cao về chủ đề

  Trả về JSON object với format:
  {
    "questions": string[], // Mảng các câu hỏi
    "expectedKeywords": string[], // Các từ khóa quan trọng cần có trong câu trả lời
    "difficultyLevel": "basic" | "intermediate" | "advanced" // Độ khó của chủ đề
  }`;

  const messages = [
    { role: "system", content: systemPromptForQuestionGeneration },
  ];
  
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      messages: messages,
      model: process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT || "gpt-4.0",
      temperature: 0.7,
      max_completion_tokens: 1000,
    });

    if (response.choices && response.choices.length > 0) {
      const text = response.choices[0].message.content.trim();
      const result = JSON.parse(text);
      
      if (!result.questions || !Array.isArray(result.questions)) {
        console.error('Invalid questions format received from AI:', result);
        return [];
      }
      
      return result.questions;
    } else {
      console.error("Unexpected API response format for question generation:", response);
      return [];
    }
  } catch (error) {
    console.error('Error generating questions for topic:', error);
    return [`Could not generate questions for ${topic}.`];
  }
};

/**
 * Kiểm tra câu trả lời có đầy đủ không
 */
export const evaluateAnswer = async (question, answer) => {
  const prompt = `Hãy đánh giá câu trả lời sau cho câu hỏi "${question}":
  ${answer}
  
  Trả về JSON object với format:
  {
    "isComplete": boolean, // Câu trả lời có đầy đủ không
    "score": number, // Điểm số từ 0-10
    "strengths": string[], // Các điểm mạnh trong câu trả lời
    "weaknesses": string[], // Các điểm yếu cần cải thiện
    "missingPoints": string[], // Các điểm chưa được đề cập
    "feedback": string, // Phản hồi chi tiết
    "suggestedImprovements": string[], // Các đề xuất cải thiện
    "followUpQuestions": string[] // Các câu hỏi tiếp theo có thể hỏi
  }`;
  
  try {
    const response = await getAIResponse(prompt, [], {
      instruction: "Trả về kết quả dưới dạng JSON object với các trường như mô tả"
    });
    
    const evaluation = JSON.parse(response);
    
    // Đảm bảo tất cả các trường cần thiết đều tồn tại
    return {
      isComplete: evaluation.isComplete || false,
      score: evaluation.score || 0,
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      missingPoints: evaluation.missingPoints || [],
      feedback: evaluation.feedback || "Không có phản hồi chi tiết",
      suggestedImprovements: evaluation.suggestedImprovements || [],
      followUpQuestions: evaluation.followUpQuestions || []
    };
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return {
      isComplete: false,
      score: 0,
      strengths: [],
      weaknesses: ["Không thể đánh giá câu trả lời"],
      missingPoints: [],
      feedback: "Có lỗi xảy ra khi đánh giá câu trả lời",
      suggestedImprovements: [],
      followUpQuestions: []
    };
  }
}; 