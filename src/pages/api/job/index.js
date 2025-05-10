// src/pages/api/job/index.js
import connectDB from "../../../lib/mongodb";
import Job from "../../../models/job";
import User from "../../../models/User";

import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  await connectDB();

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No valid token" });
  }

  // Tìm user trong database theo clerkId
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.method === "GET") {
    const { all } = req.query; // Kiểm tra query parameter

    if (all === "true") {
      try {
        const jobs = await Job.find({ status: "Live" }) // Chỉ lấy công việc đang tuyển dụng
          .populate("companyId", "name location"); // Lấy thêm thông tin công ty (nếu cần)

        return res.status(200).json(jobs);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching all jobs", error: error.message });
      }
    }
  }


  if (!user.companyId) {
    return res.status(403).json({ message: "You must be a company owner to manage jobs" });
  }

  if (req.method === "GET") {
    try {
      const jobs = await Job.find({ companyId: user.companyId });
      return res.status(200).json(jobs);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        title,
        jobType,
        salaryMin,
        salaryMax,
        categories = [],
        requiredSkills = [],
        jobDescription,
        responsibilities,
        whoYouAre,
        niceToHaves = "",
        perksAndBenefits = [],
        dueDate,
        needs = 0
      } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!title || !jobType || !salaryMin || !salaryMax || !requiredSkills.length || !jobDescription || !responsibilities || !whoYouAre || !dueDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!["Full-Time", "Part-Time", "Remote", "Internship", "Contract"].includes(jobType)) {
        return res.status(400).json({ message: "Invalid jobType" });
      }

      if (!Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({ message: "Categories must be a non-empty array" });
      }

      // Kiểm tra danh sách benefits hợ
      // const validPerks = ["Full Healthcare", "Unlimited Vacation", "Skill Development"];
      // if (!perksAndBenefits.every(perk => validPerks.includes(perk))) {
      //   return res.status(400).json({ message: "Invalid perksAndBenefits values" });
      // }


      // Chuyển đổi salaryMin & salaryMax thành số
      const salaryMinNum = Number(salaryMin);
      const salaryMaxNum = Number(salaryMax);
      if (isNaN(salaryMinNum) || isNaN(salaryMaxNum)) {
        return res.status(400).json({ message: "Salary must be a valid number" });
      }

      if (salaryMinNum > salaryMaxNum) {
        return res.status(400).json({ message: "salaryMin must be less than or equal to salaryMax" });
      }

      // Kiểm tra dueDate hợp lệ
      const currentDate = new Date();
      const dueDateObj = new Date(dueDate);
      if (isNaN(dueDateObj.getTime()) || dueDateObj <= currentDate) {
        return res.status(400).json({ message: "dueDate must be a valid future date" });
      }

      // Tạo job mới
      const newJob = new Job({
        title,
        jobType,
        salaryMin: salaryMinNum,
        salaryMax: salaryMaxNum,
        categories,
        requiredSkills,
        jobDescription,
        responsibilities,
        whoYouAre,
        niceToHaves,
        perksAndBenefits,
        status: "Live",
        datePosted: new Date(),
        dueDate: dueDateObj,
        applicants: 0,
        needs: needs || 0,
        companyId: user.companyId
      });

      await newJob.save();
      return res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }


  if (req.method === "PUT") {
    try {
      const { jobId, title, jobDescription, salaryMin, salaryMax, requiredSkills } = req.body;

      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.companyId.toString() !== user.companyId.toString()) {
        return res.status(403).json({ message: "You can only update your own company's jobs" });
      }

      job.title = title || job.title;
      job.jobDescription = jobDescription || job.jobDescription;
      job.salaryMin = salaryMin ? Number(salaryMin) : job.salaryMin;
      job.salaryMax = salaryMax ? Number(salaryMax) : job.salaryMax;
      job.requiredSkills = requiredSkills || job.requiredSkills;

      await job.save();
      return res.status(200).json({ message: "Job updated successfully", job });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { jobId } = req.body;
      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.companyId.toString() !== user.companyId.toString()) {
        return res.status(403).json({ message: "You can only delete your own company's jobs" });
      }

      await Job.findByIdAndDelete(jobId);
      return res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
