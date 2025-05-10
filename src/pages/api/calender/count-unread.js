// pages/api/calender/count-unread.js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "../../../lib/mongodb";
import Calender from "../../../models/Calender";
import User from "../../../models/User"; // Import model User

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const { userId: clerkId } = getAuth(req); // clerkId từ Clerk
        if (!clerkId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        // Tìm _id của User qua clerkId
        const user = await User.findOne({ clerkId });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Đếm số lượng thông báo chưa đọc
        const count = await Calender.countDocuments({
          userID: user._id, // Sử dụng _id từ User
          read: false,
        });

        res.json({ count });
        break;
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Lỗi API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}