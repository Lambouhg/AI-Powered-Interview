import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const CHATBASE_SECRET = process.env.CHATBASE_SECRET_KEY as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { userId } = req.body;

  if (!userId || !CHATBASE_SECRET) {
    return res.status(400).json({ error: "Missing userId or secret key" });
  }

  const hmac = crypto
    .createHmac("sha256", CHATBASE_SECRET)
    .update(userId)
    .digest("hex");

  return res.status(200).json({ hmac });
}
