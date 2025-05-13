import formidable from "formidable";
import fs from "fs";
import { supabase } from "../../../../config/supabaseClient";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User"; 

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  await connectDB();

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw new Error("Form parsing failed: " + err.message);

      const clerkId = fields.userId?.[0]; // Lấy từ Clerk FE gửi qua
      if (!clerkId) {
        return res.status(400).json({ success: false, message: "Thiếu Clerk userId (clerkId)" });
      }

      const uploadedFile = files?.cv;
      if (!uploadedFile || !Array.isArray(uploadedFile) || !uploadedFile[0]) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const file = uploadedFile[0];
      const fileBuffer = fs.readFileSync(file.filepath);
      const fileExt = file.originalFilename.split(".").pop();
      const fileName = `cv_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype || "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Supabase upload error:", uploadError);
        return res.status(500).json({ success: false, error: uploadError.message });
      }

      const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(fileName);
      const publicUrl = urlData?.publicUrl;

      if (!publicUrl) {
        return res.status(500).json({ success: false, error: "Không thể lấy public URL" });
      }

      // ✅ Cập nhật cvUrl theo clerkId
      const updated = await User.findOneAndUpdate(
        { clerkId },
        { cvUrl: publicUrl },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, error: "Không tìm thấy user theo clerkId" });
      }

      console.log("✅ Upload & Mongo update thành công:", publicUrl);

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
