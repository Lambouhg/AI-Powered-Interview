import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "PUT") {
    try {
      const { userId, role } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({ message: "Cập nhật role thành công", user: updatedUser });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Lỗi server", error });
    }
  }
}