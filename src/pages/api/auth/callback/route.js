import connectDB from "../../../../lib/mongodb.js";
import User from "../../../../models/User";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    await connectDB(); // Kết nối database

    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    // Lấy thông tin user từ Clerk
    const userResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    });
    const userData = await userResponse.json();

    let user = await User.findOne({ clerkId: userData.id });

    if (!user) {
      let role = "user";
      let companyId = null;

      if (userData.email_addresses[0].email_address === "exw81173@jioso.com") {
        role = "admin";
      }

      if (role === "company") {
        // 🔥 Nếu user là công ty, tạo companyId mới
        const newCompany = new Company({
          name: userData.first_name + "'s Company",
          ownerId: userData.id,
        });
        await newCompany.save();
        companyId = newCompany._id;
      }

      user = new User({
        clerkId: userData.id,
        email: userData.email_addresses[0].email_address,
        name: userData.first_name + " " + userData.last_name,
        avatar: userData.image_url,
        role,
        companyId, // Lưu companyId nếu có
      });

      await user.save();
    }

    res.status(200).json({
      user: {
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        companyId: user.companyId || null, // Trả về companyId nếu có
      },
    });
  } catch (error) {
    console.error("❌ Lỗi trong API route:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
}
