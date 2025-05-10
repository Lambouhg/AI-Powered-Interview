import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI không được định nghĩa trong .env.local");
}

// 🛠 Dùng biến toàn cục để tránh tạo nhiều kết nối
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn; // Dùng lại kết nối cũ
  }

  if (!cached.promise) {
    console.log("📡 Đang kết nối MongoDB...");
    try {
      cached.promise = mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false, // ⚡ Tắt buffer giúp giảm độ trễ
        autoIndex: false, // ⚡ Tắt autoIndex trên production để tối ưu tốc độ
        maxPoolSize: 10, // ⚡ Giới hạn số lượng kết nối đồng thời
      }).then((mongoose) => {
        console.log("✅ Kết nối MongoDB thành công!");
        return mongoose;
      });

      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      console.error("❌ Lỗi khi kết nối MongoDB:", error);
      cached.promise = null; // Reset cache nếu lỗi
      throw new Error("Không thể kết nối đến MongoDB!");
    }
  }

  return cached.promise;
};

export default connectDB;
