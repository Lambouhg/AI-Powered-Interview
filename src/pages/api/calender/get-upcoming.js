// pages/api/calender/get-upcoming.js
import connectDB from "../../../lib/mongodb";
import Calender from "../../../models/Calender";
import { getAuth } from "@clerk/nextjs/server";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;

  if (method !== "GET") {
    return res.status(405).end();
  }

  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Lấy ngày hiện tại (định dạng "YYYY-MM-DD")
    const currentDate = new Date().toISOString().split("T")[0];

    // Lọc theo date == currentDate
    const interviews = await Calender.find({
      userID: user._id,
      date: currentDate,
    })
      .sort({ time: 1 }) // Sắp xếp theo giờ
      .select("title description location date time");

    res.json(interviews);
  } catch (error) {
    console.error("Lỗi API:", error);
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
}