// src/pages/api/user/index.js
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

// Bật lại bodyParser vì request sử dụng JSON
export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  await connectDB();

  // Lấy thông tin xác thực từ Clerk
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No valid token" });
  }

  // Lấy otherUserId từ body nếu có (chỉ khi không phải GET request)
  const otherUserId =
    req.method === "GET" ? req.query.otherUserId : req.body.otherUserId;

  // Nếu otherUserId tồn tại, tìm user khác
  if (otherUserId) {
    const objectId = new mongoose.Types.ObjectId(otherUserId);
    try {
      const user = await User.findById(objectId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
    }
  }

  // Nếu không có otherUserId, lấy thông tin người dùng hiện tại
  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.method === "GET") {
      return res.status(200).json({ user });
    }

    if (req.method === "PATCH") {
      const updateData = req.body.user;

      // Kiểm tra nếu có socialLinks, merge với dữ liệu cũ
      if (updateData?.socialLinks) {
        updateData.socialLinks = {
          ...user.socialLinks,
          ...updateData.socialLinks,
        };
      }

      const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
}
