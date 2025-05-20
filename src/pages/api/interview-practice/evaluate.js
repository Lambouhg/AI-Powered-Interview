import connectDB from "../../../lib/mongodb";
import InterviewPractice from "../../../models/InterviewPractice";
import { evaluateAnswer } from "../../../utils/interview/geminiUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const { sessionId, questionIndex, answer } = req.body;

    if (!sessionId || questionIndex === undefined || !answer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const session = await InterviewPractice.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (questionIndex >= session.questions.length) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    const question = session.questions[questionIndex];
    const context = {
      role: session.role,
      level: session.level,
      category: session.category
    };

    // Evaluate the answer
    const evaluation = await evaluateAnswer(question, answer, context);

    // Update the question with the answer and evaluation
    session.questions[questionIndex].answer = answer;
    session.questions[questionIndex].evaluation = {
      score: evaluation.score,
      feedback: evaluation.feedback,
      suggestions: evaluation.suggestions,
      strongPoints: evaluation.strongPoints,
      missedConcepts: evaluation.missedConcepts
    };
    session.questions[questionIndex].status = 'reviewed';

    // Update session scores
    const answeredQuestions = session.questions.filter(q => q.status === 'reviewed');
    if (answeredQuestions.length > 0) {
      session.totalScore = answeredQuestions.reduce((sum, q) => sum + (q.evaluation?.score || 0), 0);
      session.averageScore = session.totalScore / answeredQuestions.length;
    }

    // Update session status if all questions are answered
    if (session.questions.every(q => q.status === 'reviewed')) {
      session.status = 'completed';
      session.endTime = new Date();
    }

    await session.save();
    res.status(200).json(evaluation);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      details: error.errors
    });
  }
}