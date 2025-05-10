// src/pages/api/company/[company_id].js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "../../../lib/mongodb";
import Company from "../../../models/company";
import User from "../../../models/User";
import getRawBody from "raw-body";
import mongoose from "mongoose";

// Cấu hình API không sử dụng bodyParser mặc định của Next.js
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  await connectDB(); // Kết nối cơ sở dữ liệu MongoDB

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No valid token" });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "company") {
    return res
      .status(403)
      .json({ message: "Only company users can manage company data" });
  }

  try {
    // Lấy company_id từ dynamic route
    const { company_id } = req.query;

    // Kiểm tra xem company_id có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(company_id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    // Xử lý các phương thức HTTP
    if (req.method === "PATCH") {
      // Cập nhật công ty (UPDATE)
      const updatedData = await getRawBody(req);
      const updateFields = JSON.parse(updatedData.toString("utf-8"));

      const updatedCompany = await Company.findByIdAndUpdate(
        company_id,
        updateFields,
        { new: true }
      );
      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }

      res
        .status(200)
        .json({
          message: "Company updated successfully",
          company: updatedCompany,
        });
    } else if (req.method === "GET") {
      // Lấy thông tin công ty theo ID (GET một công ty)
      const companyDetails = await Company.findById(company_id);
      if (!companyDetails) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.status(200).json({ company: companyDetails });
    } else if (req.method === "DELETE") {
      // Xóa công ty (DELETE)
      const companyToDelete = await Company.findById(company_id);
      if (!companyToDelete) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Sử dụng .deleteOne() thay vì .remove()
      await Company.deleteOne({ _id: company_id });
      res.status(200).json({ message: "Company deleted successfully" });
    } else {
      // Phương thức HTTP không hợp lệ
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
