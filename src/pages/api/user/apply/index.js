/* eslint-disable @typescript-eslint/no-unused-vars */
import connectDB from "../../../../lib/mongodb";
import Applicant from "../../../../models/applicant";
import User from "../../../../models/User";
import Company from "../../../../models/company";
import Job from "../../../../models/job";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    await connectDB();
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized: No valid token" });
    }
    // GET tất cả đơn xin việc theo userID:   /api/user/apply
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }

        const userObjectId = user._id;

        const applications = await Applicant.find({ userID: userObjectId })
            .populate("jobID", "title")
            .populate("companyID", "name")

        if (!applications.length) {
            return res.status(404).json({ message: "No applications found for this user" });
        }

        res.status(200).json({ applications });
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}