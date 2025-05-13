import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
  const prompt = `
    Context:
    - Position: ${context.role} (${context.level})
    - Field: ${context.field}
    - Question Category: ${context.category}
    - Difficulty Level: ${context.difficulty}

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
      "missedConcepts": ["string"],
      "overallEvaluation": "string"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Handle potential markdown code blocks in the response
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
      missedConcepts: [],
      overallEvaluation: "Evaluation failed due to a technical error."
    };
  }
};
