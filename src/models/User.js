//models/user.js
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  name: { type: String },
  avatar: { type: String },
  location: { type: String, default: "none" },
  // gender: {
  //   type: String,
  //   enum: ["female", "male", "other"],
  //   default: "other",
  // },
  aboutMe: { type: String, default: "none" },
  phone: { type: String, default: "none" },
  video: { type: String, default: "none" }, // Đường dẫn đến video giới thiệu
  cvUrl: { type: String, default: "none" },
  socialLinks: {
    // Các liên kết mạng xã hội
    instagram: { type: String, default: null },
    twitter: { type: String, default: null },
    facebook: { type: String, default: null },
    linkedin: { type: String, default: null },
    youtube: { type: String, default: null },
  },
  expereince: [
    {
      company: { type: String },
      position: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      description: { type: String },
    },
  ],
  education: [
    {
      school: { type: String },
      degree: { type: String },
      fieldOfStudy: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      description: { type: String },
    },
  ],
  Languages: { type: [String], default: () => ["English"] },

  role: { type: String, enum: ["admin", "company", "user"], default: "user" },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  }, // Chỉ có nếu role là "company"
  skills: { type: [String] },
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Applicant" }], // Danh sách job đã apply


// intermview practice
  interviewPractices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewPractice'
  }],
  
  interviewStats: {
    totalSessions: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    completedTopics: [String],
    lastPracticeDate: Date
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
