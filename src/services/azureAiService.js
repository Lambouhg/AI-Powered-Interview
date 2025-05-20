// filepath: d:\AI\AI-powered Interview\AI-Powered-Interview\src\services\azureAiService.js
/**
 * Service để tương tác với Azure OpenAI Service sử dụng thư viện OpenAI chính thức
 */
import { AzureOpenAI } from "openai";

// Hằng số cho dịch vụ Azure OpenAI
const AZURE_OPENAI_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_DEPLOYMENT = process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT || "gpt-4.0";
const AZURE_OPENAI_API_VERSION = '2024-04-01-preview';

// Khởi tạo SDK client
const getOpenAIClient = () => {
  return new AzureOpenAI({
    apiKey: AZURE_OPENAI_KEY,
    endpoint: AZURE_OPENAI_ENDPOINT,
    apiVersion: AZURE_OPENAI_API_VERSION,
    deployment: AZURE_OPENAI_DEPLOYMENT,
    dangerouslyAllowBrowser: true, // Cho phép chạy trong trình duyệt - lưu ý bảo mật
  });
};

/**
 * Gửi tin nhắn đến Azure OpenAI service và nhận phản hồi
 * 
 * @param {string} userMessage - Tin nhắn từ người dùng
 * @param {Array} conversationHistory - Lịch sử cuộc trò chuyện
 * @param {Object} options - Cấu hình bổ sung (vị trí ứng tuyển, kỹ năng,...)
 * @returns {Promise<string>} - Phản hồi từ AI
 */
export const getAIResponse = async (userMessage, conversationHistory = [], options = {}) => {
  try {
    // Kiểm tra xem API key đã được cấu hình chưa
    if (!AZURE_OPENAI_KEY || !AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_DEPLOYMENT) {
      console.warn('Azure OpenAI credentials not configured properly');
      // Trả về phản hồi mô phỏng nếu không có cấu hình
      return getMockResponse(userMessage, conversationHistory, options);
    }
    
    // Xây dựng prompt với hướng dẫn vai trò đóng vai HR phỏng vấn
    const systemPrompt = `Bạn là một chuyên gia tuyển dụng (HR) đang phỏng vấn ứng viên cho vị trí ${options.position || 'chuyên viên'}. 
                         Hãy đặt các câu hỏi chuyên nghiệp, theo đúng tiêu chuẩn phỏng vấn. 
                         Tập trung vào kỹ năng: ${options.skills || 'giao tiếp, giải quyết vấn đề, làm việc nhóm'}.
                         Đánh giá câu trả lời của ứng viên và đặt thêm câu hỏi sâu khi cần. 
                         Cuộc phỏng vấn nên giống như có một HR thật đang trò chuyện.
                         Trả lời bằng tiếng Việt, giọng điệu chuyên nghiệp nhưng thân thiện.`;

    // Xây dựng messages từ lịch sử trò chuyện
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: "user", content: userMessage }
    ];
    
    console.log('Sending request to Azure OpenAI with messages:', messages);
      try {
      // Khởi tạo client và gọi API
      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        messages: messages,
        model: AZURE_OPENAI_DEPLOYMENT,
        temperature: 0.7,
        max_completion_tokens: 800,
      });
      
      console.log('API response:', JSON.stringify(response));
      
      if (response.choices && response.choices.length > 0) {
        return response.choices[0].message.content.trim();
      } else {
        console.error('Unexpected API response format:', response);
        throw new Error('API response format not as expected');
      }
    } catch (apiError) {
      console.error('Error calling Azure OpenAI API:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
    // Nếu gặp lỗi, sử dụng phản hồi mô phỏng
    return getMockResponse(userMessage, conversationHistory, options);
  }
};

/**
 * Hàm cung cấp phản hồi mô phỏng khi không kết nối được với Azure
 */
const getMockResponse = (userMessage, conversationHistory = [], options = {}) => {
  const position = options.position || 'chuyên viên';
  const skills = options.skills || 'giao tiếp, giải quyết vấn đề, làm việc nhóm';
  
  // Danh sách các câu hỏi phỏng vấn cơ bản
  const interviewQuestions = [
    `Hãy cho tôi biết về một dự án khó khăn liên quan đến ${skills} mà bạn đã tham gia và cách bạn giải quyết các thách thức?`,
    `Làm thế nào bạn xử lý deadline gấp và áp lực công việc cao trong vị trí ${position}?`,
    `Điểm mạnh và điểm yếu lớn nhất của bạn khi làm việc với ${skills} là gì?`,
    "Bạn thường xử lý các xung đột trong nhóm làm việc như thế nào?",
    `Tại sao bạn muốn ứng tuyển vị trí ${position} tại công ty chúng tôi?`,
    `Bạn mong muốn mức lương như thế nào cho vị trí ${position}?`,
    `Bạn có câu hỏi gì về công việc ${position} hoặc công ty không?`
  ];
  
  // Số tin nhắn trong cuộc hội thoại (không tính tin nhắn đang gõ)
  const messageCount = conversationHistory.filter(msg => !msg.isTyping && !msg.isError).length;
  
  // Phân tích nội dung tin nhắn của người dùng để đưa ra câu trả lời phù hợp
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('xin chào') || lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return "Xin chào! Rất vui được gặp bạn. Bạn có thể giới thiệu thêm về kinh nghiệm làm việc của mình không?";
  } else if (lowerMsg.includes('kinh nghiệm') || lowerMsg.includes('dự án') || messageCount < 2) {
    return "Cảm ơn bạn đã chia sẻ. " + interviewQuestions[0];
  } else if (messageCount < 4) {
    return "Thông tin rất hữu ích. " + interviewQuestions[1];
  } else if (messageCount < 6) {
    return "Tôi hiểu rồi. " + interviewQuestions[2];
  } else if (messageCount < 8) {
    return "Cách tiếp cận của bạn rất thú vị. " + interviewQuestions[3];
  } else if (messageCount < 10) {
    return "Cảm ơn vì câu trả lời chi tiết. " + interviewQuestions[4];
  } else if (messageCount < 12) {
    return interviewQuestions[5];
  } else if (messageCount < 14) {
    return "Dạ, mức lương sẽ được xem xét dựa trên kinh nghiệm và kỹ năng của bạn. " + interviewQuestions[6];
  } else {
    return "Cảm ơn bạn đã tham gia buổi phỏng vấn hôm nay. Chúng tôi đánh giá cao thời gian và sự quan tâm của bạn. Chúng tôi sẽ liên hệ với bạn trong vài ngày tới để thông báo kết quả nhé.";
  }
};
