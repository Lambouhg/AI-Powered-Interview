// src/models/job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },
    categories: { type: [String], required: true },
    requiredSkills: { type: [String], required: true },
    jobDescription: { type: String, required: true },
    responsibilities: { type: String, required: true },
    whoYouAre: { type: String, required: true },
    niceToHaves: { type: String },
    perksAndBenefits: {
      type: [String],
      default: []
    },
    status: { type: String, enum: ["Live", "Draft", "Closed"], default: "Live" },
    datePosted: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    jobType: { type: String, enum: ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"], required: true },
    applicants: { type: Number, default: 0 },
    needs: { type: Number, default: 0 },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
