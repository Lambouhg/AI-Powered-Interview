"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SidebarCompany from "../../components/SidebarCompany";

const ApplicantDetails = () => {
  const router = useRouter();
  const { applicantId } = router.query;
  const [isUpdating, setIsUpdating] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); // Khởi tạo null để tránh lỗi ban đầu

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const statuses = [
    { value: "In Review", color: "text-blue-500 bg-blue-100" },
    { value: "In Reviewing", color: "text-blue-500 bg-blue-100" },
    { value: "Shortlisted", color: "text-blue-500 bg-blue-100" },
    { value: "Hired", color: "text-gray-500 bg-gray-100" },
    { value: "Rejected", color: "text-red-500 bg-red-100" }, // Sửa màu cho Rejected
  ];

  // Fetch applicant data from API
  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        if (!applicantId) return;
        setLoading(true);
        const response = await fetch(`/api/company/applicant/${applicantId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch applicant details"
          );
        }
        const data = await response.json();
        // Log dữ liệu từ API
        setApplicant(data.applicant);
        setSelectedStatus(data.applicant.status); // Cập nhật trạng thái ban đầu
      } catch (err) {
        setError(err.message || "Failed to load applicant details");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicant();
  }, [applicantId]);

  // Xử lý thay đổi trạng thái
  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/company/applicant/${applicantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update applicant status");
      }
      const data = await response.json();
      setApplicant({
        ...applicant,
        status: data.applicant.status,
      });
      setSelectedStatus(newStatus);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUpdating(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <SidebarCompany className="w-[250px] shrink-0" />

      {/* Main Content */}
      <div className="overflow-y-auto w-full h-screen pb-10 px-6">
        <main className="flex-1 max-w-6xl mx-auto">
          {/* Header */}
          <div className="w-full mt-6 border-b border-gray-200 pb-4 mb-8">
            <button
              onClick={() => router.push("/company/AllApplication")}
              className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center px-3 py-1.5 rounded-md hover:bg-blue-50 transition-all"
            >
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.77 5.27a1 1 0 010 1.41L9.414 10l3.353 3.354a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.41l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to All Applications
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Applicant Details
            </h1>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section: Applicant Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:w-1/3">
              {/* Avatar and Info */}
              <div className="flex items-center gap-4">
                {applicant && applicant.avatar ? (
                  <img
                    src={applicant.avatar}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border-2 border-gray-100">
                    <svg
                      className="w-8 h-8 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6z" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 14.5a4.5 4.5 0 00-4.5 4.5H4a6 6 0 1112 0h-1.5a4.5 4.5 0 00-4.5-4.5z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {applicant?.name || "N/A"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {applicant?.email || "N/A"}{" "}
                    {/* Sửa từ applicant.userID.email */}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {applicant?.currentJobTitle || "Applicant"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Applicant Score */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Applicant Score
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="text-xl font-semibold text-gray-800">
                    {applicant?.score !== undefined ? applicant.score : "N/A"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {applicant?.scoreReason || "No evaluation provided yet"}
                </p>
              </div>

              {/* Stage */}
              <div className="mt-6 relative">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-700 font-medium text-base">Stage</p>
                  <div className="flex items-center gap-2.5 bg-blue-50 px-3 py-1.5 rounded-full">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-600 font-semibold text-sm">
                      {applicant?.status || "In Review"}
                    </span>
                  </div>
                </div>

                <div
                  className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {/* Progress bar */}
                  <div className="w-full flex gap-2 mb-3">
                    {["In Review", "In Reviewing", "Shortlisted", "Hired"].map(
                      (stage, index) => {
                        const currentIndex = [
                          "In Review",
                          "In Reviewing",
                          "Shortlisted",
                          "Hired",
                          "Rejected",
                        ].indexOf(applicant?.status || "In Review");

                        const isActive =
                          index <= currentIndex &&
                          applicant?.status !== "Rejected";
                        const isRejected = applicant?.status === "Rejected";

                        const activeGradient =
                          index === 0
                            ? "bg-gradient-to-r from-blue-400 to-blue-500"
                            : index === 1
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : index === 2
                            ? "bg-gradient-to-r from-blue-600 to-blue-700"
                            : "bg-gradient-to-r from-blue-700 to-blue-800";

                        const rejectedGradient =
                          "bg-gradient-to-r from-red-400 to-red-500";

                        return (
                          <div
                            key={stage}
                            className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden"
                          >
                            <div
                              className={`h-full transition-all duration-500 ${
                                isActive
                                  ? activeGradient
                                  : isRejected && index === 3
                                  ? rejectedGradient
                                  : ""
                              }`}
                              style={{
                                width: isActive
                                  ? "100%"
                                  : isRejected && index === 3
                                  ? "100%"
                                  : "0%",
                              }}
                            ></div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="w-full flex gap-2">
                    {["In Review", "In Reviewing", "Shortlisted", "Hired"].map(
                      (stage, index) => {
                        const currentIndex = [
                          "In Review",
                          "In Reviewing",
                          "Shortlisted",
                          "Hired",
                          "Rejected",
                        ].indexOf(applicant?.status || "In Review");

                        const isActive =
                          index <= currentIndex &&
                          applicant?.status !== "Rejected";
                        const isRejected = applicant?.status === "Rejected";
                        const isCurrent = currentIndex === index && !isRejected;

                        return (
                          <div
                            key={stage}
                            className="flex-1 flex justify-center"
                          >
                            <span
                              className={`text-xs font-medium transition-all ${
                                isCurrent
                                  ? "text-blue-600"
                                  : isActive
                                  ? "text-blue-500"
                                  : isRejected && index === 3
                                  ? "text-red-500"
                                  : "text-gray-400"
                              }`}
                            >
                              {stage.replace("In ", "")}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute mt-3 w-56 bg-white rounded-lg shadow-lg z-10 border border-gray-100 py-1.5 animate-fadeIn">
                    <div className="absolute -top-2 right-8 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
                    <ul>
                      {statuses.map((status) => (
                        <li
                          key={status.value}
                          className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-all ${
                            applicant?.status === status.value
                              ? "bg-blue-50"
                              : ""
                          }`}
                          onClick={() => handleStatusChange(status.value)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                status.value === "Rejected"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                              }`}
                            ></div>
                            <span className={`${status.color} font-medium`}>
                              {status.value}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-700 break-all">
                        {applicant?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-700">
                        {applicant?.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        LinkedIn
                      </p>
                      <p className="text-sm text-gray-700">
                        {applicant?.linkedinURL ? (
                          <a
                            href={applicant.linkedinURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Profile
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-3">
                      Social Media
                    </p>
                    <div className="flex space-x-3">
                      {applicant?.socialLinks?.instagram && (
                        <a
                          href={applicant.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 hover:bg-pink-100 transition-all"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                      )}

                      {applicant?.socialLinks?.twitter && (
                        <a
                          href={applicant.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-all"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      )}

                      {applicant?.socialLinks?.facebook && (
                        <a
                          href={applicant.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        </a>
                      )}

                      {applicant?.portfolioURL && (
                        <a
                          href={applicant.portfolioURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 hover:bg-purple-100 transition-all"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.931 9h-2.764a14.67 14.67 0 00-.496-2.995c1.491.811 2.643 1.928 3.26 2.995zm-15.899 1c0-.566.057-1.118.152-1.659h3.065c-.057.548-.092 1.1-.092 1.659s.034 1.111.092 1.659H4.183c-.094-.541-.151-1.093-.151-1.659zm8.649-1h-3.362c.057-.549.092-1.1.092-1.659 0-.557-.034-1.11-.091-1.659h3.36c-.056.549-.091 1.102-.091 1.659 0 .56.035 1.11.092 1.659zm-.535 4.659c-.805-.567-1.505-1.673-1.95-2.995h3.9c-.445 1.322-1.145 2.428-1.95 2.995zm0-10.317c.805.567 1.505 1.672 1.95 2.995h-3.9c.445-1.322 1.145-2.428 1.95-2.995zm1.906 8.658c.231-.749.376-1.636.439-2.659h2.764a8.06 8.06 0 01-3.203 2.659zm.439-4.659c-.063-1.022-.208-1.909-.439-2.659a8.07 8.07 0 013.203 2.659H14.49zM7.85 4.683c-.23.749-.376 1.636-.439 2.659H4.646a8.056 8.056 0 013.203-2.659zm-.439 10.317c.063 1.022.208 1.91.439 2.659a8.057 8.057 0 01-3.203-2.659h2.764z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Tabs */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1">
              <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "resume"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTabChange("resume")}
                >
                  Resume
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "hiring-progress"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTabChange("hiring-progress")}
                >
                  Hiring Progress
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "interview-schedule"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTabChange("interview-schedule")}
                >
                  Interview Schedule
                </button>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <div className="flex gap-2">
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Analyzing with AI...
                  </p>
                </div>
              )}

              {error && (
                <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg">
                  <svg
                    className="w-8 h-8 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {!loading && !error && applicant && (
                <div>
                  {activeTab === "resume" && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                        Applicant Information
                      </h2>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Full Name
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {applicant.fullName || "N/A"}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Email
                            </p>
                            <p className="text-gray-800 break-all font-semibold">
                              {applicant.email || "N/A"}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Phone Number
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {applicant.phoneNumber || "N/A"}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Current Job Title
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {applicant.currentJobTitle || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Professional Links
                          </p>
                          <div className="flex flex-wrap gap-3 mt-2">
                            {applicant?.linkedinURL && (
                              <a
                                href={applicant.linkedinURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 transition-all shadow-sm"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                              </a>
                            )}

                            {applicant?.portfolioURL && (
                              <a
                                href={applicant.portfolioURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-purple-100 text-purple-800 hover:bg-purple-200 transition-all shadow-sm"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M19.5 12h-15A2.5 2.5 0 002 14.5v5A2.5 2.5 0 004.5 22h15a2.5 2.5 0 002.5-2.5v-5a2.5 2.5 0 00-2.5-2.5zm-6.25 5.5h-2.5v-2.5h2.5v2.5zm6.25-8h-15A2.5 2.5 0 002 7V4.5A2.5 2.5 0 004.5 2h15A2.5 2.5 0 0022 4.5V7a2.5 2.5 0 00-2.5 2.5z" />
                                </svg>
                                Portfolio
                              </a>
                            )}

                            {applicant?.resume && (
                              <a
                                href={applicant.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-100 text-green-800 hover:bg-green-200 transition-all shadow-sm"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                Resume (
                                {new URL(applicant.resume).pathname
                                  .split(".")
                                  .pop()
                                  .toUpperCase()}
                                )
                              </a>
                            )}
                          </div>
                        </div>

                        {applicant?.additionalInfo && (
                          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              Additional Information
                            </p>
                            <p className="text-gray-700 whitespace-pre-line">
                              {applicant.additionalInfo}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {activeTab === "hiring-progress" && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                        Hiring Progress
                      </h2>
                      <div className="mt-4">
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Current Stage:
                          </p>
                          <div className="flex items-center mt-2">
                            <span
                              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                applicant?.status
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            ></span>
                            <p className="font-semibold text-gray-800">
                              {applicant?.status || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "interview-schedule" && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                        Interview Schedule
                      </h2>
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-400 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-gray-600 font-medium">
                            No interview scheduled yet.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicantDetails;
