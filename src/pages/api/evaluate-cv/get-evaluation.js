import connectDB from "../../../lib/mongodb"; // Kết nối MongoDB
import User from "../../../models/User"; // Model User

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user ID" });
  }

  try {
    await connectDB(); // Kết nối tới MongoDB

    // Lấy lịch sử đánh giá của người dùng
    const user = await User.findOne({ clerkId: userId });

    if (!user || !user.evaluations) {
      return res.status(404).json({ success: false, message: "No evaluations found" });
    }

    return res.status(200).json({ success: true, evaluations: user.evaluations });
  } catch (err) {
    console.error("Error fetching evaluations:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching evaluations",
    });
  }
}