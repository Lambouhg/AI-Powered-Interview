//src/pages/api/job/all.js
import connectDB from "../../../lib/mongodb";
import Job from "../../../models/job";
import mongoose from "mongoose";
import "../../../models/company";

export default async function handler(req, res) {
    await connectDB();

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { jobId } = req.query;

        // Nếu có jobId, trả về chi tiết công việc
        if (jobId) {
            if (!mongoose.Types.ObjectId.isValid(jobId)) {
                return res.status(400).json({ message: "Invalid job ID" });
            }

            const job = await Job.findById(jobId)
                .populate("companyId", "name logo location"); // Thêm logo và location vào populate
            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }

            return res.status(200).json(job);
        }

        // Nếu không có jobId, trả về tất cả công việc
        const jobs = await Job.find()
            .populate("companyId", "name logo location"); // Thêm logo và location vào populate
        const totalJobs = jobs.length;

        return res.status(200).json({
            jobs,
            totalJobs,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
}