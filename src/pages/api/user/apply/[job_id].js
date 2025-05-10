import connectDB from "../../../../lib/mongodb";
import Applicant from "../../../../models/applicant";
import Job from "../../../../models/job";
import User from "../../../../models/User";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import getRawBody from "raw-body";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectDB();
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No valid token" });
  }

  const jobID = req.query.job_id;
  const jobObjectId = new mongoose.Types.ObjectId(jobID);

  try {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // DELETE đơn xin việc theo jobID:   /api/user/apply/[job_id]
    if (req.method === "DELETE") {
      const existingApplication = await Applicant.findOne({
        jobID: jobObjectId,
        userID: user._id,
      });

      if (!existingApplication) {
        return res.status(404).json({ message: "Application not found" });
      }

      await Applicant.findByIdAndDelete(existingApplication._id);

      await Job.findByIdAndUpdate(jobObjectId, { $inc: { applicants: -1 } });

      return res.status(200).json({
        message: "Application deleted successfully",
      });
    }

    // POST đơn xin việc theo jobID:   /api/user/apply/[job_id]
    if (req.method === "POST") {
      const existingApplication = await Applicant.findOne({
        jobID: jobObjectId,
        userID: user._id,
      });
    
      if (existingApplication) {
        return res.status(400).json({ message: "You have already applied for this job" });
      }
    
      // Kiểm tra số lượng đơn ứng tuyển đã đạt giới hạn hay chưa
      const job = await Job.findById(jobObjectId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
    
      if (job.applicants >= job.needs) {
        return res.status(400).json({ message: "This job has reached the maximum number of applicants" });
      }
    
      const rawBody = await getRawBody(req);
      const parsedBody = JSON.parse(rawBody.toString("utf-8"));
      const { fullName, email, phoneNumber, currentJobTitle, linkedinURL, portfolioURL, additionalInfo, resume } = parsedBody;
    
      if (!fullName || !email || !phoneNumber) {
        return res.status(400).json({ message: "Missing required fields: fullName, email, phoneNumber" });
      }
    
      const companyId = job.companyId; // Lấy companyId từ Job
    
      // Tạo đơn ứng tuyển mới
      const newApplication = new Applicant({
        jobID: jobObjectId,
        userID: user._id,
        companyID: companyId,
        fullName,
        email,
        phoneNumber,
        currentJobTitle,
        linkedinURL,
        portfolioURL,
        additionalInfo,
        resume,
      });
    
      await newApplication.save();
      await Job.findByIdAndUpdate(jobObjectId, { $inc: { applicants: 1 } });
    
      return res.status(201).json({
        message: "Application submitted successfully",
        applicant: {
          ...newApplication.toObject(),
          companyID: companyId,
        },
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}