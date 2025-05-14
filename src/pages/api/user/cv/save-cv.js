import connectDB from "../../../lib/mongodb"; // Kết nối MongoDB
import User from "../../../models/User"; // Model User

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { userId, cvData } = req.body;

  if (!userId || !cvData) {
    return res.status(400).json({ success: false, message: "Missing required data" });
  }

  try {
    await connectDB(); // Kết nối tới MongoDB

    // Cập nhật CV thông qua userId
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { cvData: cvData } }, // Lưu dữ liệu CV
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "CV saved successfully",
      cvData: user.cvData, // Trả về dữ liệu CV đã lưu
    });
  } catch (err) {
    console.error("Error saving CV:", err);
    return res.status(500).json({
      success: false,
      message: "Error saving CV",
    });
  }
}
