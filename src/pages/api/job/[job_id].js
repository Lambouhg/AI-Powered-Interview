// src/pages/api/job/[job_id].js
import connectDB from "../../../lib/mongodb";
import Job from "../../../models/job";
import { getAuth } from "@clerk/nextjs/server";
import User from "../../../models/User";
import mongoose from "mongoose";
import getRawBody from "raw-body";

// Cấu hình API không sử dụng bodyParser mặc định của Next.js
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  await connectDB();  // Kết nối cơ sở dữ liệu MongoDB
  
  const { job_id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(job_id)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }
  

  const job = await Job.findById(job_id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const { userId } = getAuth(req);  // Lấy userId từ token
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No valid token" });
  }

  // Lấy thông tin người dùng từ Clerk
  const user = await User.findOne({ clerkId: userId });
  if (!user || user.role !== "company") {
    return res.status(403).json({ message: "Only company users can manage jobs" });
  }

  if (!user.companyId || job.companyId.toString() !== user.companyId.toString()) {
    return res.status(403).json({ message: "You are not allowed to modify this job" });
  }

  // Xử lý các phương thức HTTP
  if (req.method === "GET") {
    // Lấy công việc theo ID
    res.status(200).json({ job });
  } else if (req.method === "PATCH") {
    try {
      const rawBody = await getRawBody(req);
      const updateData = JSON.parse(rawBody.toString("utf-8"));

      // Cập nhật công việc
      const updatedJob = await Job.findByIdAndUpdate(job_id, updateData, { new: true });
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
      res.status(500).json({ message: "Error updating job", error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      // Xóa công việc theo ID
      await Job.findByIdAndDelete(job_id);
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting job", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
