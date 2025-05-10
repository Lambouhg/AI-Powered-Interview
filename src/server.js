import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // Load file .env.local
import connectDB from "./lib/mongodb.js";
(async () => {
  await connectDB();
})();
