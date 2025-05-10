import { analyzeJobDescription } from "../../../utils/geminiUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { jobDescription, responsibilities, whoYouAre, niceToHaves } = req.body;

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ 
      message: "Google API key is not configured",
      error: "Missing GOOGLE_API_KEY environment variable"
    });
  }

  try {
    const analysis = await analyzeJobDescription(
      jobDescription,
      responsibilities,
      whoYouAre,
      niceToHaves
    );
    
    res.status(200).json({ result: analysis });
  } catch (error) {
    console.error("Error analyzing job:", error);
    res.status(500).json({ 
      message: "Failed to analyze job description",
      error: error.message 
    });
  }
}
