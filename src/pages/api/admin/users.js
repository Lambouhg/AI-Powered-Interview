import connectDB  from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connectDB();

  try {
    const users = await User.find({}, { password: 0 }); // Loại bỏ trường mật khẩu
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
}