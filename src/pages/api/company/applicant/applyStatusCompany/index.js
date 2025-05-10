import connectDB from "../../../../../lib/mongodb";
import Applicant from "../../../../../models/applicant";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const companyId = req.query.companyId;
  if (!companyId) {
    return res
      .status(400)
      .json({ success: false, message: "Company ID is required" });
  }

  try {
    await connectDB();

    const applicants = await Applicant.find({
      status: "Shortlisted",
      companyID: companyId,
    });

    return res.status(200).json({ applicants });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
