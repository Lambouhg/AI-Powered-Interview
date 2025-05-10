import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    jobID: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    applicantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicant",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.models.Calender ||
  mongoose.model("Calender", applicantSchema);
