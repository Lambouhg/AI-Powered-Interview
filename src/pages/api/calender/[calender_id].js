import { getAuth } from "@clerk/nextjs/server";
import connectDB from "../../../lib/mongodb";
import Calender from "../../../models/Calender"; // Model MongoDB

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;
  try {
    switch (method) {
      case "GET":
        const calenderID = req.query.calender_id;
        if (!calenderID) {
          return res.status(400).json({ message: "Missing calender ID" });
        }
        const { userId } = getAuth(req);
        if (!userId) {
          return res
            .status(401)
            .json({ message: "Unauthorized: No valid token" });
        }

        const events = await Calender.findById(calenderID);
        return res.status(200).json(events);
      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
