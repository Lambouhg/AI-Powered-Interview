import connectDB from "../../../lib/mongodb";
import Company from "../../../models/company";
import User from "../../../models/User";
import { getAuth } from "@clerk/nextjs/server";
import getRawBody from "raw-body";
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No valid token" });
    }

    try {
      const user = await User.findOne({ clerkId: userId });
      if (!user || !user.companyId) {
        return res.status(404).json({ message: "User does not own a company" });
      }

      const company = await Company.findById(user.companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.status(200).json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } else if (req.method === "POST") {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No valid token" });
    }

    try {
      const user = await User.findOne({ clerkId: userId });
      if (!user || user.role !== "company") {
        return res
          .status(403)
          .json({ message: "Only company users can create companies" });
      }

      const existingCompany = await Company.findOne({ ownerId: user._id });
      if (existingCompany) {
        return res
          .status(400)
          .json({
            message:
              "User already owns a company. Only one company is allowed.",
          });
      }

      const rawBody = await getRawBody(req);
      const requestData = JSON.parse(rawBody.toString("utf-8"));

      const newCompany = new Company({
        ...requestData,
        ownerId: user._id,
      });

      await newCompany.save();
      user.companyId = newCompany._id;
      await user.save();

      res
        .status(201)
        .json({ message: "Company created successfully", company: newCompany });
    } catch (error) {
      console.error("❌ Error creating company:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
