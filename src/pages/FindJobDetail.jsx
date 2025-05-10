"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardHeader from "../components/DashboardHeader";

import img1 from "../assets/image.png";
import CompanySidebar from "../components/SidebarCompany";
import Sidebar from "../components/Sidebar";
import { useUser } from "@clerk/nextjs";

export default function FindJobDetail() {
  const { user } = useUser();
  const router = useRouter();
  const { jobId } = router.query;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    currentJobTitle: "",
    linkedinURL: "",
    portfolioURL: "",
    additionalInfo: "",
    resume: "",
  });
  const [charCount, setCharCount] = useState(0);
  const DEFAULT_COMPANY_LOGO = "https://cdn-icons-png.flaticon.com/512/3132/3132084.png";
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!jobId) return;
    const fetchJobDetail = async () => {
      try {
        const response = await fetch(`/api/job/all?jobId=${jobId}`);
        if (!response.ok) throw new Error("Failed to fetch job details");
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "additionalInfo") {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.resume
    ) {
      return alert("Please fill all required fields");
    }

    try {
      const response = await fetch(`/api/user/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setIsOpen(false);
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          currentJobTitle: "",
          linkedinURL: "",
          portfolioURL: "",
          additionalInfo: "",
          resume: "",
        });
        setCharCount(0);
      } else {
        const errorData = await response.json();
        alert(`Failed to apply for the job: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const handleBack = () => router.back();

  const handleAnalyzeJob = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/analyzejob/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: job.jobDescription,
          responsibilities: job.responsibilities,
          whoYouAre: job.whoYouAre,
          niceToHaves: job.niceToHaves,
        }),
      });

      const data = await res.json();
      const parsedResult = JSON.parse(data.result);

      if (res.ok) {
        setAnalysisResult(parsedResult);
      } else {
        setAnalysisResult("Đã xảy ra lỗi khi phân tích.");
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult("Lỗi kết nối đến server.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <p className="text-gray-600 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500 bg-red-50 rounded-lg mx-auto max-w-md mt-20">
        {error}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-lg mx-auto max-w-md mt-20">
        Job not found.
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
      {userRole === "company" && (
        <CompanySidebar className="w-[250px] shrink-0" />
      )}
      {userRole === "user" && <Sidebar className="w-[250px] shrink-0" />}

      <div className="overflow-y-auto w-full h-screen pb-12 px-8">
        <main className="flex-1">
          <div className="w-full mt-8 border-b-2 border-gray-200/50 pb-4 mb-10">
            <DashboardHeader
              dashboardHeaderName={"Job Detail"}
              onBack={handleBack}
            />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.01] transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
              <img
    src={job.companyId?.logo || DEFAULT_COMPANY_LOGO}
    alt={`${job.companyId?.name || 'Company'} logo`}
    width={80}
    height={80}
    className="w-20 h-20 rounded-full border-4 border-blue-100 p-1 object-cover"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = DEFAULT_COMPANY_LOGO;
    }}
  />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    <span className="text-blue-600 font-semibold">
                      {job.companyId?.name}
                    </span>{" "}
                    •{" "}
                    <span className="text-green-600 font-semibold">
                      {job.jobType}
                    </span>
                  </p>
                </div>
                {/* filepath: d:\WDP_301\src\pages\FindJobDetail.js */}
                <button
                  className={`bg-gradient-to-r ${user
                      ? "from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                      : "from-gray-400 to-gray-500 text-gray-300 cursor-not-allowed"
                    } font-semibold px-8 py-3 rounded-full shadow-md transform ${user ? "hover:scale-105" : ""
                    } transition-all duration-300`}
                  onClick={() => user && setIsOpen(true)} // Chỉ mở form nếu có user
                  disabled={!user} // Vô hiệu hóa nút nếu không có user
                >
                  Apply Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <StatCard title="Description" value={job.jobDescription} />
                <StatCard
                  title="Responsibilities"
                  value={job.responsibilities
                    ?.split("\n")
                    .map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                />
                <StatCard
                  title="Who You Are"
                  value={job.whoYouAre?.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                />
                <StatCard
                  title="Nice-To-Haves"
                  value={job.niceToHaves?.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                />
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-red-500 text-lg font-medium animate-pulse">
                      Support: Click the button to analyze the job description.
                    </p>
                    <button
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all animate-pulse"
                      onClick={handleAnalyzeJob}
                      disabled={analyzing}
                    >
                      {analyzing ? "Analyzing..." : "Analyze"}
                    </button>
                  </div>
                </div>

                {analysisResult && (
                  <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
                    <h3 className="font-semibold text-gray-800 mb-4">
                      Chào bạn tôi sẽ giúp bạn phân tích công việc trên, dưới đây là mô tả các yêu cầu của công việc:
                    </h3>
                    {typeof analysisResult === "object" ? (
                      <div className="space-y-4">
                        {Object.entries(analysisResult).map(([key, value]) => (
                          <div key={key}>
                            <h4 className="text-md font-semibold text-gray-800">
                              {key}
                            </h4>
                            {Array.isArray(value) ? (
                              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                {value.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-700">{value}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-gray-700">
                        {analysisResult}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Job Overview
                  </h3>
                  <p className="text-gray-700 mb-3">
                    <span className="font-medium text-blue-600">
                      {job.applicants}
                    </span>{" "}
                    applied of <span className="font-medium">{job.needs}</span>{" "}
                    capacity
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(job.applicants / job.needs) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Apply Before:</span>
                      <span className="text-gray-900 font-medium">
                        {new Date(job.dueDate).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Job Posted On:</span>
                      <span className="text-gray-900 font-medium">
                        {new Date(job.datePosted).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Job Type:</span>
                      <span className="text-gray-900 font-medium">
                        {job.jobType}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Salary:</span>
                      <span className="text-gray-900 font-medium">
                        ${job.salaryMin} - ${job.salaryMax}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.categories?.map((category, index) => (
                      <span
                        key={index}
                        className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-200 transform hover:scale-105 transition-all duration-300"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transform hover:scale-105 transition-all duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Popup Application Form */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 bg-gray-50 rounded-t-lg border-b sticky top-0 z-10">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="text-emerald-500 font-bold">JOB</div>
                </div>
                <div>
                  <h1 className="text-gray-700 font-bold">{job.title}</h1>
                </div>
                <button
                  className="ml-auto text-gray-400 hover:text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-lg font-medium mb-6">Submit your application</h2>
              <p className="text-sm text-gray-500 mb-8">
                The following is required and will only be shared with {job.companyId?.name}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Full name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Email address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Phone number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Current or previous job title
                  </label>
                  <input
                    type="text"
                    name="currentJobTitle"
                    placeholder="What is your current or previous job title?"
                    className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.currentJobTitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">LINKS</h3>
                  <div className="space-y-2 mb-4">
                    <label className="block text-sm font-bold text-gray-700">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedinURL"
                      placeholder="Link to your LinkedIn URL"
                      className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={formData.linkedinURL}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Portfolio URL</label>
                    <input
                      type="url"
                      name="portfolioURL"
                      placeholder="Link to your portfolio URL"
                      className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={formData.portfolioURL}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <label className="block text-sm font-bold text-gray-700">
                    Additional information
                  </label>
                  <div className="border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-indigo-500">
                    <textarea
                      name="additionalInfo"
                      placeholder="Add a cover letter or anything else you want to share"
                      className="p-3 w-full rounded-md focus:outline-none min-h-[120px] resize-none"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      maxLength={500}
                    />
                    <div className="flex items-center p-3 border-t">
                      <div className="flex space-x-2 text-gray-400">
                        <button type="button" className="focus:outline-none">📷</button>
                        <button type="button" className="focus:outline-none">B</button>
                        <button type="button" className="focus:outline-none">I</button>
                        <button type="button" className="focus:outline-none">•</button>
                        <button type="button" className="focus:outline-none">#</button>
                        <button type="button" className="focus:outline-none">🔗</button>
                      </div>
                      <div className="ml-auto text-xs text-gray-400">
                        <span className="ml-2">{charCount}/500</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <label className="block text-sm font-bold text-gray-700">Resume URL</label>
                  <input
                    type="url"
                    name="resume"
                    placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                    className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.resume}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-4 rounded-md hover:bg-indigo-700 transition duration-200 font-medium"
                  >
                    Submit Application
                  </button>
                  <p className="text-xs text-gray-500 mt-6 text-center">
                    By sending this request you can confirm that you accept our
                    <a href="#" className="text-indigo-600 hover:underline ml-1">
                      Terms of Service
                    </a>{" "}
                    and
                    <a href="#" className="text-indigo-600 hover:underline ml-1">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      {Array.isArray(value) ? (
        <ul className="list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
          {value}
        </ul>
      ) : (
        <p className="text-gray-700 leading-relaxed">{value}</p>
      )}
    </div>
  );
}