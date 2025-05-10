//src/pages/api/company/all.js
import mongoose from "mongoose";
import Company from "../../../models/company";

const connectToDatabase = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === "GET") {
        try {
            // Kiểm tra nếu có query parameter 'id'
            const { id } = req.query;

            if (id) {
                // Lấy chi tiết công ty theo ID
                const companyDetails = await Company.aggregate([
                    {
                        $match: { _id: new mongoose.Types.ObjectId(id) }
                    },
                    {
                        $lookup: {
                            from: "jobs",
                            localField: "_id",
                            foreignField: "companyId",
                            as: "jobs"
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "team.user",
                            foreignField: "_id",
                            as: "teamDetails"
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "ownerId",
                            foreignField: "_id",
                            as: "ownerDetails"
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            logo: 1,
                            description: 1,
                            website: 1,
                            employees: 1,
                            industry: 1,
                            dateFounded: 1,
                            techStack: 1,
                            location: 1,
                            socialLinks: 1,
                            contact: 1,
                            jobsCount: { $size: "$jobs" },
                            jobs: 1,
                            team: "$teamDetails",
                            owner: { $arrayElemAt: ["$ownerDetails", 0] } // Lấy thông tin chủ sở hữu
                        }
                    }
                ]);

                if (!companyDetails.length) {
                    return res.status(404).json({ message: "Company not found" });
                }

                // Trả về công ty đầu tiên (vì $match chỉ trả về 1 document)
                return res.status(200).json(companyDetails[0]);
            } else {
                // Lấy tất cả công ty (logic hiện tại)
                const companies = await Company.aggregate([
                    {
                        $lookup: {
                            from: "jobs",
                            localField: "_id",
                            foreignField: "companyId",
                            as: "jobs"
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            logo: 1,
                            description: 1,
                            industry: 1,
                            jobsCount: { $size: "$jobs" }
                        }
                    }
                ]);
                return res.status(200).json(companies);
            }
        } catch (error) {
            console.error("Error fetching company details: ", error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
