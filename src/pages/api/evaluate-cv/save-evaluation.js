import connectDB from "../../../lib/mongodb";  // Kết nối MongoDB
import User from "../../../models/User";  // Model User

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { userId, cvUrl, score, feedback, suggestions, highlights } = req.body;

  // Kiểm tra dữ liệu gửi lên
  if (!userId || !cvUrl || score === undefined || !feedback || !suggestions || !highlights) {
    return res.status(400).json({ success: false, message: "Missing required data" });
  }

  try {
    await connectDB(); // Kết nối tới MongoDB

    // Cập nhật hoặc ghi đè kết quả đánh giá vào user
    const user = await User.findOneAndUpdate(
      { clerkId: userId },  // Tìm user theo clerkId
      {
        $push: {  // Thêm một đánh giá mới vào lịch sử đánh giá
          evaluations: {
            cvUrl,
            score,
            feedback,
            suggestions,
            highlights,
            date: new Date(),
          },
        },
      },
      { new: true, upsert: true }  // Nếu không có user, tạo mới
    );

    return res.status(200).json({
      success: true,
      message: "Evaluation saved successfully",
      evaluations: user.evaluations, // Trả về lịch sử đánh giá của người dùng
    });
  } catch (err) {
    console.error("Error saving evaluation:", err);
    return res.status(500).json({
      success: false,
      message: "Error saving evaluation",
    });
  }
}