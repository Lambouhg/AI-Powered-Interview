//src/models/company.js
import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    logo: { type: String },  // Logo công ty (link đến ảnh logo)
    name: { type: String, required: true },  // Tên công ty
    website: { type: String },  // Website công ty
    employees: { type: Number, default: 0 },  // Số lượng nhân viên
    industry: { type: String },  // Ngành nghề công ty
    dateFounded: { type: Date },  // Ngày thành lập công ty
    techStack: { type: [String] },  // Các công nghệ mà công ty sử dụng
    location: { type: String, default: "none" },  // Địa chỉ công ty
    description: { type: String },  // Mô tả về công ty
    socialLinks: {  // Các liên kết mạng xã hội
      instagram: { type: String, default: null },
      twitter: { type: String, default: null },
      facebook: { type: String, default: null },
      linkedin: { type: String, default: null },
      youtube: { type: String, default: null },
    },
    contact: {  // Thông tin liên hệ
      email: { type: String, required: null },
      phone: { type: String, required: null },
    },
    team: [{  // Danh sách thành viên trong team
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // Tham chiếu đến người dùng trong team
    }],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Chủ sở hữu công ty
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]  // Các công việc liên quan đến công ty
  },
  { timestamps: true }
);

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
