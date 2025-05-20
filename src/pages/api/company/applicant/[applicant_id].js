import mongoose from "mongoose";
import connectDB from "../../../../lib/mongodb";
import Applicant from "../../../../models/applicant";
import User from "../../../../models/User";
import { getAuth } from "@clerk/nextjs/server";
import { evaluateApplicant } from "../../../../utils/geminiUtils";
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

      // Evaluate applicant using Gemini if no score exists
      if (applicant.score === 0 || !applicant.scoreReason) {
        const jobInfo = {
          title: applicant.jobID.title,
          description: applicant.jobID.jobDescription,
          requiredSkills: applicant.jobID.requiredSkills,
          responsibilities: applicant.jobID.responsibilities,
          whoYouAre: applicant.jobID.whoYouAre,
          niceToHaves: applicant.jobID.niceToHaves
        };

        const applicantInfo = {
          resume: applicant.resume,
          additionalInfo: applicant.additionalInfo,
          skills: applicant.userID.skills,
          experience: applicant.userID.experience
        };

        try {
          const evaluation = await evaluateApplicant(jobInfo, applicantInfo);
          
          // Update applicant with evaluation results
          applicant.score = evaluation.score;
          applicant.scoreReason = evaluation.reason;
          applicant.strengths = evaluation.strengths;
          applicant.weaknesses = evaluation.weaknesses;
          applicant.recommendations = evaluation.recommendations;
          
          await applicant.save();
        } catch (error) {
          console.error("Error evaluating applicant:", error);
          // Continue with the response even if evaluation fails
        }
      }

      res.status(200).json(applicant);
    } catch (error) {
      console.error("Error fetching applicant:", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: error.message 
      });
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
    res.status(405).json({ message: "Method not allowed" });
  }
}