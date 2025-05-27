import { getAIResponse, getOpenAIClient } from './azureAiService';

/**
 * Phân tích đoạn giới thiệu để trích xuất các chủ đề chính
 */
export const extractTopics = async (introduction) => {
  const prompt = `Hãy phân tích đoạn text sau. Nếu đoạn text là một lời giới thiệu bản thân và kinh nghiệm làm việc chuyên nghiệp, hãy trích xuất các chủ đề kỹ năng chính. Nếu không phải, trả về một mảng JSON rỗng []. Trả về kết quả dưới dạng JSON array:
  ${introduction}`;
  
  try {
    const response = await getAIResponse(prompt, [], {
      instruction: "Trả về kết quả dưới dạng JSON array, mỗi phần tử là một chủ đề kỹ năng, HOẶC mảng rỗng [] nếu không phải giới thiệu."
    });
    
    // Parse JSON từ response
    const topics = JSON.parse(response);
    // Thêm kiểm tra để đảm bảo kết quả là mảng
    if (!Array.isArray(topics)) {
      console.error('Invalid topics format received from AI:', topics);
      return [];
    }
    return topics;
  } catch (error) {
    console.error('Error extracting topics:', error);
    return [];
  }
};

/**
 * Tạo danh sách câu hỏi cho một chủ đề
 */
export const generateQuestionsForTopic = async (topic) => {
  // Sử dụng system prompt mới chỉ tập trung vào việc tạo câu hỏi kỹ thuật
  const systemPromptForQuestionGeneration = `Bạn là một chuyên gia phỏng vấn kỹ thuật. Nhiệm vụ của bạn là tạo ra 5 câu hỏi phỏng vấn về chủ đề kỹ thuật "${topic}". Các câu hỏi nên đi từ cơ bản đến nâng cao và tập trung vào việc đánh giá kiến thức và kinh nghiệm thực tế của ứng viên về chủ đề này. Trả về kết quả dưới dạng JSON array chứa chỉ các chuỗi (string), mỗi chuỗi là một câu hỏi phỏng vấn.`;

  // Không cần user prompt trong trường hợp này, chỉ cần system prompt
  const messages = [
    { role: "system", content: systemPromptForQuestionGeneration },
  ];
  
  try {
    // Gọi API với messages được xây dựng riêng
    const client = getOpenAIClient(); // Assuming getOpenAIClient is accessible or imported
    const response = await client.chat.completions.create({
      messages: messages,
      model: process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT || "gpt-4.0", // Sử dụng model từ env
      temperature: 0.5, // Có thể giảm temperature để kết quả ít ngẫu nhiên hơn
      max_completion_tokens: 500, // Giới hạn token cho phản hồi
    });

    if (response.choices && response.choices.length > 0) {
      const text = response.choices[0].message.content.trim();
      // Parse JSON từ response
      const questions = JSON.parse(text);
      
      // Thêm kiểm tra để đảm bảo kết quả là mảng các chuỗi
      if (!Array.isArray(questions) || !questions.every(q => typeof q === 'string')) {
        console.error('Invalid questions format received from AI:', questions);
        return [];
      }
      
      return questions;
    } else {
      console.error("Unexpected API response format for question generation:", response);
      return [];
    }
  } catch (error) {
    console.error('Error generating questions for topic:', error);
    // Trả về câu hỏi fallback hoặc rỗng nếu có lỗi
    return [`Could not generate questions for ${topic}.`]; // Fallback question
  }
};

/**
 * Kiểm tra câu trả lời có đầy đủ không
 */
export const evaluateAnswer = async (question, answer) => {
  const prompt = `Hãy đánh giá câu trả lời sau cho câu hỏi "${question}":
  ${answer}
  
  Trả về JSON với format:
  {
    "isComplete": boolean,
    "missingPoints": string[],
    "feedback": string
  }`;
  
  try {
    const response = await getAIResponse(prompt, [], {
      instruction: "Trả về kết quả dưới dạng JSON object"
    });
    
    // Parse JSON từ response
    const evaluation = JSON.parse(response);
    return evaluation;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return {
      isComplete: true,
      missingPoints: [],
      feedback: "Không thể đánh giá câu trả lời"
    };
  }
}; 