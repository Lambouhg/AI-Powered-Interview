import { getAuth } from "@clerk/nextjs/server";
import connectDB from "../../../lib/mongodb";
import Calender from "../../../models/Calender"; // Model MongoDB
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();
  const { method } = req;
  try {
    switch (method) {
      case "GET":
        const { userId } = getAuth(req);
        const companyId = req.query.companyId;
        if (!userId) {
          return res
            .status(401)
            .json({ message: "Unauthorized: No valid token" });
        }
        const events = await Calender.find({
          companyID: new mongoose.Types.ObjectId(companyId),
        });
        return res.status(200).json(events);

      case "POST":
        const {
          jobID,
          userID,
          companyID,
          applicantID,
          title,
          description,
          location,
          date,
          time,
        } = req.body;
        const newEvent = new Calender({
          jobID,
          userID,
          companyID,
          applicantID,
          title,
          description,
          location,
          date,
          time,
        });
        await newEvent.save();
        return res.status(201).json(newEvent);

      case "PUT":
        const { id, updatedEvent } = req.body;
        const updated = await Calender.findByIdAndUpdate(id, updatedEvent, {
          new: true,
        });
        return res.status(200).json(updated);

      case "DELETE":
        const { idCalender } = req.body;
        await Calender.findByIdAndDelete(idCalender);
        return res.status(200).json({ message: "Event deleted successfully" });
      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
