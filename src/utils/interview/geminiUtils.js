import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "../../lib/mongodb";
import InterviewQuestion from "../../models/InterviewQuestion";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generateNewQuestions = async (role, level, category) => {
  // Trước tiên, lấy tất cả câu hỏi hiện có cho role/level/category
  const existingQuestions = await InterviewQuestion.find({
    role,
    level,
    category,
  }, { question: 1, idealAnswer: 1, keyPoints: 1 }); // Lấy thêm idealAnswer và keyPoints để so sánh chính xác hơn

  console.log(`Found ${existingQuestions.length} existing questions for ${role} (${level}) - ${category}`);
  
  // Tạo danh sách các câu hỏi đã tồn tại để tránh trùng lặp
  const existingQuestionTexts = existingQuestions.map(q => q.question);
  
  // Thêm một số dấu hiệu ngẫu nhiên để đảm bảo mỗi lần gọi API là khác nhau
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  
  // Tạo một số chủ đề ngẫu nhiên cho mỗi role/category để thêm vào prompt
  const topicsByRole = {
    "Software Engineer": ["algorithms", "data structures", "system design", "performance", "testing", "debugging", "security", "scalability", "maintainability", "code quality", "architecture", "frameworks", "languages", "databases", "cloud computing"],
    "Product Manager": ["market research", "user stories", "prioritization", "strategy", "roadmaps", "metrics", "user experience", "stakeholder management", "product lifecycle", "competitive analysis", "go-to-market", "feature prioritization", "user feedback", "product vision", "agile methodologies"],
    "Data Scientist": ["statistics", "machine learning", "data analysis", "visualization", "modeling", "feature engineering", "model evaluation", "data preprocessing", "deep learning", "natural language processing", "computer vision", "time series", "recommendation systems", "big data", "data ethics"],
    "DevOps Engineer": ["CI/CD", "infrastructure", "monitoring", "security", "automation", "containerization", "orchestration", "cloud platforms", "networking", "logging", "alerting", "disaster recovery", "performance optimization", "configuration management", "infrastructure as code"],
    // Thêm các role khác nếu cần
    "default": ["technical skills", "problem-solving", "teamwork", "communication", "innovation", "leadership", "project management", "time management", "adaptability", "critical thinking", "decision making", "collaboration", "creativity", "analytical skills", "strategic thinking"]
  };

  // Chọn topics dựa trên role hoặc dùng default nếu không có
  const availableTopics = topicsByRole[role] || topicsByRole.default;
  
  // Chọn ngẫu nhiên 3-4 topics
  const numTopics = Math.floor(Math.random() * 2) + 3; // 3-4 topics
  const selectedTopics = [];
  
  for (let i = 0; i < numTopics && availableTopics.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableTopics.length);
    selectedTopics.push(availableTopics[randomIndex]);
    availableTopics.splice(randomIndex, 1);
  }
  
  const topicsString = selectedTopics.join(", ");
  console.log(`Generating questions for ${role} (${level}) with focus on: ${topicsString}`);

  // Thêm một số câu hỏi hiện có vào prompt để tránh tạo ra câu hỏi tương tự
  let existingQuestionsPrompt = "";
  if (existingQuestionTexts.length > 0) {
    // Lấy ngẫu nhiên tối đa 5 câu hỏi để tránh
    const sampleSize = Math.min(5, existingQuestionTexts.length);
    const sampleQuestions = [];
    
    // Lấy mẫu ngẫu nhiên không lặp lại
    const indices = new Set();
    while (indices.size < sampleSize) {
      indices.add(Math.floor(Math.random() * existingQuestionTexts.length));
    }
    
    Array.from(indices).forEach(idx => {
      sampleQuestions.push(existingQuestionTexts[idx]);
    });
    
    existingQuestionsPrompt = `
    IMPORTANT: DO NOT generate questions similar to the following existing questions:
    ${sampleQuestions.map((q, i) => `${i+1}. ${q}`).join("\n")}
    
    Your questions MUST be completely different from these.`;
  }

  const prompt = `You are an expert interviewer for ${role} positions.
    Generate 5 unique and diverse interview questions appropriate for a ${level} ${role} position.
    The questions should be in the ${category} category.
    
    Focus especially on these topics: ${topicsString}
    
    Use timestamp ${timestamp}-${randomSuffix} to make questions unique.
    DO NOT include the timestamp in your response.
    ${existingQuestionsPrompt}
    
    IMPORTANT GUIDELINES:
    1. Each question must be unique and cover different aspects of the role
    2. Questions should test different skills and knowledge areas
    3. Vary the question format (scenario-based, technical, behavioral, etc.)
    4. Ensure questions are appropriate for the specified level
    5. Include a mix of theoretical and practical questions
    6. Make questions specific and detailed, not generic
    7. Include real-world scenarios and challenges
    8. Avoid any questions that might be similar to existing ones
    9. Each question should focus on a different topic or skill
    10. Ensure diversity in question types and difficulty levels
    
    Your response MUST be a valid JSON that can be parsed by JSON.parse(). Do not include any markdown formatting, code blocks, or explanatory text.
    Return ONLY a JSON object with the following structure:
    {
      "questions": [
        {
          "question": "The detailed interview question",
          "idealAnswer": "A comprehensive model answer that would score 10/10",
          "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
        }
      ]
    }`;

  try {
    // Thêm temperature để tăng tính ngẫu nhiên
    const generationConfig = {
      temperature: 0.8, // Tăng temperature để tạo ra câu hỏi đa dạng hơn
      topP: 0.9,
    };
    
    console.log("Calling Gemini API with temperature 0.8");
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text to ensure it's valid JSON
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
    
    // Loại bỏ timestamp khỏi câu hỏi nếu xuất hiện
    const timestampString = `${timestamp}-${randomSuffix}`;
    parsedResponse.questions = parsedResponse.questions.map(q => {
      return {
        ...q,
        question: q.question.replace(timestampString, '').trim(),
        idealAnswer: q.idealAnswer.replace(timestampString, '').trim()
      };
    });

    // Kiểm tra trùng lặp với câu hỏi đã có trong DB
    const newQuestions = [];
    const duplicates = [];
    
    for (const question of parsedResponse.questions) {
      // Kiểm tra xem câu hỏi đã tồn tại chưa bằng cách so sánh tương đối
      const isDuplicate = existingQuestions.some(existingQ => {
        // So sánh câu hỏi
        const questionSimilar = 
          normalizeString(existingQ.question).includes(normalizeString(question.question)) || 
          normalizeString(question.question).includes(normalizeString(existingQ.question));
        
        // So sánh câu trả lời mẫu
        const answerSimilar = 
          normalizeString(existingQ.idealAnswer).includes(normalizeString(question.idealAnswer)) || 
          normalizeString(question.idealAnswer).includes(normalizeString(existingQ.idealAnswer));
        
        // So sánh key points
        const keyPointsSimilar = existingQ.keyPoints && question.keyPoints && 
          existingQ.keyPoints.some(existingPoint => 
            question.keyPoints.some(newPoint => 
              normalizeString(existingPoint).includes(normalizeString(newPoint)) || 
              normalizeString(newPoint).includes(normalizeString(existingPoint))
            )
          );
        
        return questionSimilar || (answerSimilar && keyPointsSimilar);
      });
      
      if (isDuplicate) {
        duplicates.push(question.question);
      } else {
        newQuestions.push(question);
      }
    }
    
    console.log(`Filtered out ${duplicates.length} duplicate questions`);
    
    if (duplicates.length > 0) {
      console.log("Duplicates:", duplicates);
    }

    // Nếu tất cả câu hỏi đều bị trùng lặp, tạo thêm câu hỏi mới
    if (newQuestions.length === 0 && duplicates.length > 0) {
      console.log("All questions were duplicates. Re-generating with stronger constraints...");
      // Đệ quy gọi lại hàm với thêm tham số để đánh dấu là lần gọi lại
      return generateNewQuestions(role, level, category);
    }

    // Save new questions to database
    const questionsToSave = newQuestions.map(q => ({
      question: q.question,
      idealAnswer: q.idealAnswer,
      keyPoints: q.keyPoints,
      role,
      level,
      category
    }));

    if (questionsToSave.length > 0) {
      await InterviewQuestion.insertMany(questionsToSave);
      console.log(`Generated and saved ${questionsToSave.length} new unique questions to database`);
    } else {
      console.log("No new unique questions to save");
    }

    // Trả về response với các câu hỏi đã lọc trùng lặp
    return {
      questions: newQuestions
    };
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};

// Hàm hỗ trợ chuẩn hóa chuỗi để so sánh tương đối
function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Loại bỏ dấu câu
    .replace(/\s+/g, ' ')    // Thay thế nhiều khoảng trắng bằng một khoảng trắng
    .trim();
}

export const generateQuestions = async (role, level, category) => {
  try {
    await connectDB();

    // Đếm tổng số câu hỏi phù hợp với điều kiện
    const totalCount = await InterviewQuestion.countDocuments({
      role,
      level,
      category,
      isActive: true
    });

    console.log(`Found ${totalCount} matching questions in database`);

    // Luôn tạo 2-3 câu hỏi mới cho mỗi phiên phỏng vấn
    const numNewQuestions = Math.floor(Math.random() * 2) + 2; // 2-3 câu hỏi mới
    console.log(`Generating ${numNewQuestions} new questions`);
    
    // Tạo câu hỏi mới
    const newQuestionsResult = await generateNewQuestions(role, level, category);
    const newQuestions = newQuestionsResult.questions.slice(0, numNewQuestions);
    
    // Nếu có đủ số lượng câu hỏi trong DB, lấy thêm câu hỏi cũ
    if (totalCount >= (5 - numNewQuestions)) {
      // Lấy ngẫu nhiên các câu hỏi cũ
      const randomSkip = totalCount > (5 - numNewQuestions) ? 
        Math.floor(Math.random() * (totalCount - (5 - numNewQuestions))) : 0;
      
      console.log(`Using random skip: ${randomSkip} for existing questions`);
      
      const existingQuestions = await InterviewQuestion.find({
        role,
        level,
        category,
        isActive: true
      })
      .sort({ usageCount: 1, lastUsed: 1 })
      .skip(randomSkip)
      .limit(5 - numNewQuestions);

      // Update usage count and last used for existing questions
      if (existingQuestions.length > 0) {
        await InterviewQuestion.updateMany(
          { _id: { $in: existingQuestions.map(q => q._id) } },
          { 
            $inc: { usageCount: 1 },
            $set: { lastUsed: new Date() }
          }
        );
      }

      // Kết hợp câu hỏi mới và cũ
      const allQuestions = [
        ...existingQuestions.map(q => ({
          question: q.question,
          idealAnswer: q.idealAnswer,
          keyPoints: q.keyPoints
        })),
        ...newQuestions
      ];

      console.log(`Returning ${allQuestions.length} questions (${existingQuestions.length} existing + ${newQuestions.length} new)`);
      return { questions: allQuestions };
    }

    // Nếu không đủ số lượng câu hỏi trong DB, tạo thêm câu hỏi mới
    console.log("Not enough questions in DB, generating more new ones");
    
    // Tạo thêm câu hỏi mới để đủ 5 câu
    const additionalQuestions = await generateNewQuestions(role, level, category);
    const finalQuestions = [...newQuestions, ...additionalQuestions.questions].slice(0, 5);
    
    console.log(`Returning ${finalQuestions.length} new questions`);
    return { questions: finalQuestions };
  } catch (error) {
    console.error("Error in generateQuestions:", error);
    throw error;
  }
};

export const evaluateAnswer = async (question, answer, context) => {
  const prompt = `
    Context:
    - Position: ${context.role} (${context.level})
    - Question Category: ${context.category}

    Question: "${question.question}"
    Expected Key Points: ${JSON.stringify(question.keyPoints)}
    Candidate's Answer: "${answer}"
    
    Evaluate this interview answer and provide:
    1. Score (1-10)
    2. Detailed feedback based on the role level and key points covered
    3. Three specific suggestions for improvement
    4. Highlight any particularly strong points
    5. Identify any missed key concepts
    
    Your response MUST be a valid JSON that can be parsed by JSON.parse(). Do not include any markdown formatting, code blocks, or explanatory text.
    Return ONLY a JSON object with the following structure:
    {
      "score": number,
      "feedback": "string",
      "suggestions": ["string", "string", "string"],
      "strongPoints": ["string"],
      "missedConcepts": ["string"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text to ensure it's valid JSON
    let jsonText = text;
    if (text.includes("```json")) {
      jsonText = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
      jsonText = text.split("```")[1].split("```")[0].trim();
    }
    
    // Parse the JSON
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    // Return a basic structure if there's an error
    return {
      score: 0,
      feedback: "An error occurred during evaluation. Please try again.",
      suggestions: ["Try again"],
      strongPoints: [],
      missedConcepts: []
    };
  }
};