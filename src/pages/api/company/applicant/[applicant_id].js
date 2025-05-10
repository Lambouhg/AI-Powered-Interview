import mongoose from "mongoose";
import connectDB from "../../../../lib/mongodb";
import Applicant from "../../../../models/applicant";
import User from "../../../../models/User";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios"; // Import axios
import getRawBody from "raw-body";

export const config = {
  api: {
    bodyParser: false,
  },
};

const apiKey = process.env.OPENROUTER_API_KEY;

export default async function handler(req, res) {
  await connectDB();
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No valid token" });
  }

  if (req.method === "GET") {
    try {
      const { applicant_id } = req.query;

      if (!mongoose.Types.ObjectId.isValid(applicant_id)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }

      const user = await User.findOne({ clerkId: userId });
      if (!user || user.role !== "company") {
        return res.status(403).json({
          message: "Access denied. Only companies can view applicants.",
        });
      }

      const applicant = await Applicant.findById(applicant_id)
        .populate("userID", "name email phone avatar appliedJobs socialLinks skills experience")
        .populate("jobID", "title jobDescription requiredSkills responsibilities whoYouAre niceToHaves")
        .select("+resume");

      if (!applicant || !applicant.userID || !applicant.jobID) {
        return res.status(404).json({ message: "Applicant or related data not found" });
      }

      if (applicant.companyID.toString() !== user.companyId.toString()) {
        return res.status(403).json({
          message: "You are not authorized to view this applicant.",
        });
      }

      // Tính điểm bằng OpenRouter nếu chưa có score
      if (applicant.score === 0 || !applicant.scoreReason) {
        const job = applicant.jobID;
        const jobText = `
          Job Title: ${job.title}
          Description: ${job.jobDescription}
          Required Skills: ${job.requiredSkills.join(", ")}
          Responsibilities: ${job.responsibilities}
          Who You Are: ${job.whoYouAre}
          Nice to Haves: ${job.niceToHaves || "None"}
        `;
        const applicantText = `
          Resume: ${applicant.resume || "Not provided"}
          Additional Info: ${applicant.additionalInfo || "Not provided"}
          Skills: ${(applicant.userID.skills || []).join(", ")}
          Experience: ${JSON.stringify(applicant.userID.experience || [])}
        `;

        const prompt = `
        Đánh giá mức độ phù hợp của ứng viên với công việc dựa trên:
        - Thông tin công việc: "${jobText}"
        - Thông tin ứng viên: "${applicantText}"
        Trả về một điểm số từ 1.0 đến 5.0 (có thể là số thập phân như 2.3, 3.5) và một lý do ngắn gọn bằng tiếng Việt theo định dạng: "Điểm: X.X - Lý do".
        `;

        // Gọi API OpenRouter
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "openai/gpt-3.5-turbo",
            messages: [
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        const aiResult = response.data.choices[0].message.content.trim();
        // Sửa regex để khớp với "Điểm: X.X - Lý do"
        const scoreMatch = aiResult.match(/Điểm: (\d+\.\d+|\d+) - (.*)/);
        const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
        const reason = scoreMatch ? scoreMatch[2] : "Evaluated by AI";

        // Giới hạn score trong khoảng 1.0 - 5.0
        applicant.score = Math.min(Math.max(score, 1.0), 5.0);
        applicant.scoreReason = reason;
        await applicant.save();
      }

      res.status(200).json({
        message: "Applicant details fetched successfully",
        applicant: {
          _id: applicant._id,
          userID: applicant.userID._id,
          status: applicant.status,
          jobID: applicant.jobID._id,
          fullName: applicant.fullName,
          email: applicant.email,
          phoneNumber: applicant.phoneNumber,
          currentJobTitle: applicant.currentJobTitle,
          linkedinURL: applicant.linkedinURL,
          portfolioURL: applicant.portfolioURL,
          additionalInfo: applicant.additionalInfo,
          resume: applicant.resume,
          createdAt: applicant.createdAt,
          updatedAt: applicant.updatedAt,
          avatar: applicant.userID.avatar,
          name: applicant.userID.name,
          appliedJobs: applicant.userID.appliedJobs,
          socialLinks: applicant.userID.socialLinks,
          skills: applicant.userID.skills,
          experience: applicant.userID.experience,
          score: applicant.score,
          scoreReason: applicant.scoreReason,
        },
      });
    } catch (error) {
      console.error("Error fetching applicant:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  } else if (req.method === "PUT") {
    const { applicant_id } = req.query;
    try {
      const rawBody = await getRawBody(req);
      const parsedBody = JSON.parse(rawBody.toString("utf-8"));
      const { status } = parsedBody;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const validStatuses = ["In Review", "In Reviewing", "Shortlisted", "Hired", "Rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`,
        });
      }

      const user = await User.findOne({ clerkId: userId });
      if (!user || user.role !== "company") {
        return res.status(403).json({
          message: "Access denied. Only companies can update applicants' status.",
        });
      }

      const applicant = await Applicant.findById(applicant_id);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }

      if (applicant.companyID.toString() !== user.companyId.toString()) {
        return res.status(403).json({
          message: "You are not authorized to update this applicant's status.",
        });
      }

      applicant.status = status;
      await applicant.save();

      res.status(200).json({
        message: "Applicant status updated successfully",
        applicant: {
          _id: applicant._id,
          userID: applicant.userID,
          status: applicant.status,
        },
      });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}