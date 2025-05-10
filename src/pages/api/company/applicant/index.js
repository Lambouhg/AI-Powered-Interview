import connectDB from "../../../../lib/mongodb";
import Applicant from "../../../../models/applicant";
import Job from "../../../../models/job";
import User from "../../../../models/User";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  await connectDB();
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No valid token" });
  }

  try {
    // Tìm user hiện tại
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra role có phải "company" không
    if (user.role !== "company") {
      return res
        .status(403)
        .json({
          message: "Access denied. Only company accounts can view applicants.",
        });
    }

    // Lấy companyId của công ty
    const companyId = user.companyId;
    if (!companyId) {
      return res
        .status(400)
        .json({ message: "Company ID not found for this user." });
    }

    // Nếu có query jobId, tìm ứng viên theo jobId
    const { jobId } = req.query;

    if (jobId) {
      // Tìm job theo jobId
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Lấy danh sách ứng viên đã apply vào công việc này
      const applicants = await Applicant.find({ jobID: jobId })
        .populate("userID", "name email phone") // Populate thông tin ứng viên từ model User
        .populate("jobID", "title"); // Populate thông tin job ứng tuyển

      return res.status(200).json({ applicants });
    }

    // Nếu không có jobId trong query, lấy tất cả ứng viên của công ty
    const jobs = await Job.find({ companyId }).select("_id");
    if (!jobs.length) {
      return res
        .status(404)
        .json({ message: "No jobs found for this company." });
    }

    // Trích xuất jobIDs từ danh sách job
    const jobIds = jobs.map((job) => job._id);

    // Lấy tất cả ứng viên đã apply vào các job này
    const applicants = await Applicant.find({ jobID: { $in: jobIds } })
      .populate("userID", "name email phone") // Populate thông tin ứng viên từ model User
      .populate("jobID", "title"); // Populate thông tin job ứng tuyển

    res.status(200).json({ applicants });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
