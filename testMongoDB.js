import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://viettdqe170219:KTiOMNdRfWejBLKb@cluster0.otgtk.mongodb.net/";

async function testMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI); // Không cần `useNewUrlParser` & `useUnifiedTopology`
    console.log("✅ Kết nối MongoDB thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error);
  } finally {
    mongoose.connection.close();
  }
}

testMongoDB();
