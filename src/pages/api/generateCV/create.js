import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { generateMissingCVFields } from "../../../utils/cv/geminiCV";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const { userId } = req.body; // giả sử truyền userId (hoặc lấy từ auth/session)

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const user = await User.findById(userId).lean();
    console.log("Fetched user:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const suggestions = await generateMissingCVFields(user);

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Error generating missing CV fields:", error);
    res.status(500).json({
      success: false,
      message: "AI failed to generate missing CV fields",
      error: error.message,
    });
  }
}
