// pages/api/calender/get-notifications.js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "../../../lib/mongodb";
import Calender from "../../../models/Calender";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const { userId: clerkId } = getAuth(req);
        if (!clerkId) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const notifications = await Calender.find({
          userID: user._id,
          read: false,
        })
          .sort({ createdAt: -1 })
          .select("title description location date time read createdAt");

        res.json(notifications);
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