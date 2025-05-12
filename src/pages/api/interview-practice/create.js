// src/pages/api/interview-practice/create.js
import connectDB from "../../../lib/mongodb";
import InterviewPractice from "../../../models/InterviewPractice";
import { generateQuestions } from "../../../utils/interview/geminiUtils";

const validRoles = ["Software Developer", "QA Engineer", "Business Analyst", "Project Manager"];
const validLevels = ["Intern", "Junior", "Senior", "Lead", "Manager"];
const validCategories = ["Technical", "Behavioral", "System Design", "Problem Solving"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { userId, role, level, category } = req.body;

    if (!userId || !role || !level || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate field values
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: "Invalid level" });
    }
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ 
        message: "Google API key is not configured",
        error: "Missing GOOGLE_API_KEY environment variable"
      });
    }

    // Generate questions using Gemini
    let generatedQuestions;
    try {
      generatedQuestions = await generateQuestions(role, level, category);
    } catch (error) {
      console.error("Error generating questions:", error);
      return res.status(500).json({ 
        message: "Failed to generate questions",
        error: error.message
      });
    }
    
    // Create new session
    const session = new InterviewPractice({
      user: userId,
      role,
      level,
      category,
      questions: generatedQuestions.questions.map(q => ({
        question: q.question,
        answer: "",
        evaluation: null,
        idealAnswer: q.idealAnswer,
        keyPoints: q.keyPoints || [],
        status: 'pending'
      })),
      status: "in_progress",
      startTime: new Date()
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating interview session:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message,
      details: error.errors
    });
  }
}