import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    Analyze the following job description and extract key information:
    Job Description: ${jobDescription}
    Responsibilities: ${responsibilities}
    Who You Are: ${whoYouAre}
    Nice to Haves: ${niceToHaves}
    
    Return a JSON object with the following structure:
    {
      "skills": ["skill1", "skill2"],
      "experience": ["exp1", "exp2"],
      "education": ["edu1", "edu2"],
      "softSkills": ["soft1", "soft2"],
      "requirements": ["req1", "req2"],
      "responsibilities": ["resp1", "resp2"],
      "benefits": ["benefit1", "benefit2"]
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
    console.error("Error analyzing job description:", error);
    throw new Error(`Failed to analyze job description: ${error.message}`);
  }
};

export const evaluateApplicant = async (jobInfo, applicantInfo) => {
  const prompt = `
    Evaluate the applicant's fit for the position based on:
    Job Information: ${JSON.stringify(jobInfo)}
    Applicant Information: ${JSON.stringify(applicantInfo)}
    
    Return a JSON object with the following structure:
    {
      "score": number (1.0-5.0),
      "reason": "Detailed explanation in Vietnamese",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "recommendations": ["rec1", "rec2"]
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