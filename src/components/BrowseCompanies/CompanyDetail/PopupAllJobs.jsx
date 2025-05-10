//src/components/BrowseCompanies/CompanyDetail/PopupAllJobs.jsx
import React from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import img1 from "../../../assets/image.png"; // Đảm bảo đường dẫn đúng với cấu trúc dự án
const DEFAULT_COMPANY_LOGO = "https://cdn-icons-png.flaticon.com/512/3132/3132084.png";
const PopupAllJobs = ({
  showPopup,
  setShowPopup,
  jobs,
  currentJobs,
  company,
  currentPage,
  totalPages,
  handlePageChange,
  jobsPerPage,
}) => {
  const router = useRouter();

  return (
    showPopup && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto transform scale-95 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
              All Open Jobs
            </h2>
            <button
              onClick={() => setShowPopup(false)}
              className="text-gray-600 hover:text-gray-800 text-2xl font-bold transition-colors duration-200"
            >
              
            </button>
          </div>
          {jobs.length > 0 ? (
            <div className="space-y-6">
              {currentJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                  onClick={() => router.push(`/FindJobDetail?jobId=${job._id}`)}
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={job.companyId?.logo || DEFAULT_COMPANY_LOGO}
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

          {jobs.length > jobsPerPage && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200"
              >
                <FaAngleDoubleLeft size={20} />
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200"
              >
                <FaAngleLeft size={20} />
              </Button>
              {(() => {
                const pages = [];
                if (totalPages <= 3) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  const showEllipsisBefore = currentPage > 3;
                  const showEllipsisAfter = currentPage < totalPages - 2;
                  pages.push(1);
                  if (showEllipsisBefore) pages.push("...");
                  const startPage = Math.max(2, currentPage - 1);
                  const endPage = Math.min(totalPages - 1, currentPage + 1);
                  for (let i = startPage; i <= endPage; i++) pages.push(i);
                  if (showEllipsisAfter) pages.push("...");
                  if (totalPages > 1) pages.push(totalPages);
                }
                return pages.map((page, index) => (
                  <Button
                    key={index}
                    onClick={() => page !== "..." && handlePageChange(page)}
                    disabled={page === "..."}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${currentPage === page
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        : page === "..."
                          ? "bg-transparent text-gray-600 cursor-default"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {page}
                  </Button>
                ));
              })()}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200"
              >
                <FaAngleRight size={20} />
              </Button>
              <Button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200"
              >
                <FaAngleDoubleRight size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default PopupAllJobs;
