import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  try {
    const { userId, getToken } = getAuth(req);

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No valid session" });
    }

    const token = await getToken();
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Unable to retrieve token" });
    }

    return res.status(200).json({
      message: "Token retrieved successfully",
      token,
      userId,
    });
  } catch (error) {
    console.error("❌ Error in /api/auth/token:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
