//src/components/BrowseCompanies/CompanyDetail/OpenJob.jsx
import React from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import img1 from "../../../assets/image.png"; // Đảm bảo đường dẫn đúng với cấu trúc dự án

const OpenJob = ({ company, limitedJobs, onShowAll }) => {
  const router = useRouter();
  const DEFAULT_COMPANY_LOGO = "https://cdn-icons-png.flaticon.com/512/3132/3132084.png";
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">
          Open Jobs
        </h2>
        <button
          onClick={onShowAll}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
        >
          Show All ({company.jobsCount || 0}) <span className="text-xl">→</span>
        </button>
      </div>
      {limitedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {limitedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              onClick={() => router.push(`/FindJobDetail?jobId=${job._id}`)}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={company.logo || DEFAULT_COMPANY_LOGO}
                  alt={`${company.name} logo`}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full border-2 border-blue-200 p-1"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_COMPANY_LOGO;
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {job.title || "Untitled Job"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {company.name} •{" "}
                    {job.location || company.location || "Not specified"}
                  </p>
                  <div className="flex mt-2 gap-2 flex-wrap">
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {job.type || "Full-Time"}
                    </span>
                    {job.categories?.map((category, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No open jobs available</p>
      )}
    </div>
  );
};

export default OpenJob;
