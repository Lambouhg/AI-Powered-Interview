import formidable from "formidable";
import fs from "fs";
import { supabase } from "../../../../config/supabaseClient";  // Đường dẫn đến file supabaseClient.js
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";

export const config = {
  api: {
    bodyParser: false,  // Tắt bodyParser mặc định của Next.js để có thể xử lý file upload
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  await connectDB();  // Kết nối với MongoDB

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw new Error("Form parsing failed: " + err.message);

      const clerkId = fields.userId?.[0];  // Lấy userId từ Clerk từ FE gửi lên
      if (!clerkId) {
        return res.status(400).json({ success: false, message: "Thiếu Clerk userId (clerkId)" });
      }

      const uploadedFile = files?.cv;
      if (!uploadedFile || !Array.isArray(uploadedFile) || !uploadedFile[0]) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const file = uploadedFile[0];
      const fileBuffer = fs.readFileSync(file.filepath);  // Đọc file dưới dạng buffer
      const fileExt = file.originalFilename.split(".").pop();  // Lấy phần mở rộng file
      const fileName = `cv_${Date.now()}.${fileExt}`;  // Tạo tên file mới

      // Upload file lên Supabase
      const { error: uploadError } = await supabase.storage
        .from("cvs")  // Tên bucket Supabase
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype || "application/pdf",  // Đặt contentType cho file
          upsert: true,  // Cho phép ghi đè nếu file đã tồn tại
        });

      if (uploadError) {
        console.error("❌ Supabase upload error:", uploadError);
        return res.status(500).json({ success: false, error: uploadError.message });
      }

      // Lấy public URL của file đã upload
      const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(fileName);
      const publicUrl = urlData?.publicUrl;

      if (!publicUrl) {
        return res.status(500).json({ success: false, error: "Không thể lấy public URL" });
      }

      // ✅ Cập nhật cvUrl trong MongoDB
      const updatedUser = await User.findOneAndUpdate(
        { clerkId },  // Tìm user theo clerkId
        { cvUrl: publicUrl },  // Cập nhật cvUrl
        { new: true }  // Trả về user đã được cập nhật
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, error: "Không tìm thấy user theo clerkId" });
      }

      console.log("✅ Upload & Mongo update thành công:", publicUrl);

      // Trả về URL của file vừa upload
      return res.status(200).json({
        success: true,
        url: publicUrl,
      });
    } catch (err) {
      console.error("🔥 Lỗi backend upload-cv:", err.message);
      return res.status(500).json({
        success: false,
        error: err.message || "Unknown server error",
      });
    }
  });
}
