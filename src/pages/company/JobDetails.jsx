"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  Briefcase,
  PieChart,
} from "lucide-react";
import SidebarCompany from "../../components/SidebarCompany";
import HeaderCompany from "../../components/HeaderCompany";
import { useRouter } from "next/router";

// Define the SVG path data as constants
const EDIT_ICON_PATH =
  "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z";
const DELETE_ICON_PATH =
  "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";

const JobDetails = () => {
  const router = useRouter();
  const { job_id } = router.query;
  const [showModal, setShowModal] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!job_id) return;

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/job/${job_id}`);
        if (!response.ok) throw new Error("Failed to fetch job details");
        const data = await response.json();
        setJob(data.job);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [job_id]);

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...updatedData,
        categories: updatedData.categories || [],
        requiredSkills: updatedData.requiredSkills || [],
        perksAndBenefits: updatedData.perksAndBenefits || [],
      };
      const response = await fetch(`/api/job/${job_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to update job details");
      }
      const data = await response.json();
      setJob(data.job);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteJob = async () => {
    try {
      const response = await fetch(`/api/job/${job_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      router.push("/company/JobListingCompany");
    } catch (err) {
      setError(err.message);
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const tabs = [
    {
      key: "details",
      label: "Job Details",
      icon: <FileText className="w-5 h-5" />,
      path: null,
    },
    {
      key: "applicants",
      label: "Applicants",
      icon: <Briefcase className="w-5 h-5" />,
      path: `/company/ApplicantsTracking?job_id=${job_id}`,
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <PieChart className="w-5 h-5" />,
      path: `/company/Analytics?job_id=${job_id}`,
    },
  ];

  const currentTab = "details";

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-3"
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
            <h2 className="text-xl font-bold">Error Loading Job Details</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push(`/company/JobListingCompany`)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Job Listings
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 bg-white shadow-sm">
          <HeaderCompany />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                  {job.title}
                </span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex flex-wrap gap-2">
                {job.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01"
                  />
                </svg>
                <span>{job.jobType}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full text-sm text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{job.applicants || 0} Applicants</span>
              </div>
            </div>

            <div className="mb-8">
              <nav className="flex p-1 bg-gray-100 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`flex items-center justify-center flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${currentTab === tab.key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-blue-600"
                      }`}
                    onClick={() => tab.path && handleNavigation(tab.path)}
                  >
                    <span className="flex items-center">
                      {tab.icon}
                      <span className="ml-2">{tab.label}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                      Job Information
                    </h2>
                    <div className="flex gap-3">
                      <button
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center"
                        onClick={() => {
                          setShowModal(true);
                          setUpdatedData({
                            title: job.title,
                            jobType: job.jobType,
                            salaryMin: job.salaryMin,
                            salaryMax: job.salaryMax,
                            categories: job.categories || [],
                            requiredSkills: job.requiredSkills,
                            newSkill: "",
                            jobDescription: job.jobDescription,
                            responsibilities: job.responsibilities,
                            whoYouAre: job.whoYouAre,
                            niceToHaves: job.niceToHaves,
                            perksAndBenefits: job.perksAndBenefits || [],
                            dueDate: job.dueDate,
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={EDIT_ICON_PATH}
                          />
                        </svg>
                        + Edit Job
                      </button>
                      <button
                        className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center"
                        onClick={() => setShowConfirmDelete(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={DELETE_ICON_PATH}
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-8">
                    <div>
                      <h3 className=" text-lg block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                        Description
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">
                          {job.jobDescription}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className=" text-lg block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                        Responsibilities
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">
                          {job.responsibilities}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className=" text-lg block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                        Who You Are
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">
                          {job.whoYouAre}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className=" text-lg block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                        Nice-To-Haves
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">
                          {job.niceToHaves}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className=" text-lg block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                        Perks & Benefits
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {job.perksAndBenefits.map((perk, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                            >
                              {perk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className=" text-lg block mb-1 font-semibold bg-gradient-to-r from-gray-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                      About this role
                    </h3>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Applicants
                        </div>
                        <div className="font-medium">{job.applicants || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Apply Before
                        </div>
                        <div className="font-medium">
                          {new Date(job.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Job Posted On
                        </div>
                        <div className="font-medium">
                          {new Date(job.datePosted).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Job Type
                        </div>
                        <div className="font-medium">{job.jobType}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-gray-500 mb-1">
                          Salary Range
                        </div>
                        <div className="font-medium text-green-700">
                          ${job.salaryMin} - ${job.salaryMax} USD
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="block mb-1 font-semibold bg-gradient-to-r from-gray-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                      Categories
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {job.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700 text-indigo-700 hover:bg-indigo-200 transition-colors"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="block mb-1 font-semibold bg-gradient-to-r from-gray-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                      Required Skills
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal Container */}
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 space-y-4 overflow-y-auto max-h-[85vh]">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-lg font-semibold">Edit Job Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Job Title */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={updatedData.title || ""}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Job Type
                  </label>
                  <select
                    value={updatedData.jobType || ""}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        jobType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                      Min Salary
                    </label>
                    <input
                      type="number"
                      value={updatedData.salaryMin || ""}
                      onChange={(e) =>
                        setUpdatedData({
                          ...updatedData,
                          salaryMin: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                      Max Salary
                    </label>
                    <input
                      type="number"
                      value={updatedData.salaryMax || ""}
                      onChange={(e) =>
                        setUpdatedData({
                          ...updatedData,
                          salaryMax: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                </div>

                {/* Categories Dropdown */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {[
                      "Tech",
                      "Marketing",
                      "Finance",
                      "HR",
                      "Sales",
                      "Other",
                    ].map((category) => (
                      <label key={category} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={category}
                          checked={(updatedData.categories || []).includes(
                            category
                          )}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const selectedCategories = [
                              ...(updatedData.categories || []),
                            ];
                            if (isChecked) {
                              setUpdatedData({
                                ...updatedData,
                                categories: [...selectedCategories, category],
                              });
                            } else {
                              setUpdatedData({
                                ...updatedData,
                                categories: selectedCategories.filter(
                                  (item) => item !== category
                                ),
                              });
                            }
                          }}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Required Skills
                  </label>
                  {/* Input và nút "+" */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={updatedData.newSkill || ""}
                      onChange={(e) =>
                        setUpdatedData({
                          ...updatedData,
                          newSkill: e.target.value.trim(),
                        })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter a skill"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          updatedData.newSkill &&
                          !updatedData.requiredSkills.includes(
                            updatedData.newSkill
                          )
                        ) {
                          setUpdatedData({
                            ...updatedData,
                            requiredSkills: [
                              ...(updatedData.requiredSkills || []),
                              updatedData.newSkill,
                            ],
                            newSkill: "", // Xóa nội dung input sau khi thêm
                          });
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      +
                    </button>
                  </div>
                  {/* Danh sách các kỹ năng đã thêm */}
                  <div className="flex flex-wrap gap-2">
                    {(updatedData.requiredSkills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => {
                            setUpdatedData({
                              ...updatedData,
                              requiredSkills: updatedData.requiredSkills.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Job Description
                  </label>
                  <textarea
                    value={updatedData.jobDescription || ""}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        jobDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows="3"
                  />
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Responsibilities
                  </label>
                  <textarea
                    value={updatedData.responsibilities || ""}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        responsibilities: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows="3"
                  />
                </div>

                {/* Who You Are */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Who You Are
                  </label>
                  <textarea
                    value={updatedData.whoYouAre || ""}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        whoYouAre: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows="3"
                  />
                </div>

                {/* Nice to have */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Nice-To-Haves
                  </label>
                  <textarea
                    value={updatedData.niceToHaves || ""}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        niceToHaves: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows="3"
                  />
                </div>
                {/* Perks & Benefits Checkboxes */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Perks & Benefits
                  </label>
                  <div className="space-y-2">
                    {[
                      "Full Healthcare",
                      "Unlimited vacation",
                      "Skill development",
                      "Other",
                    ].map((perk) => (
                      <label key={perk} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={perk}
                          checked={(
                            updatedData.perksAndBenefits || []
                          ).includes(perk)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const selectedPerks = [
                              ...(updatedData.perksAndBenefits || []),
                            ];
                            if (isChecked) {
                              setUpdatedData({
                                ...updatedData,
                                perksAndBenefits: [...selectedPerks, perk],
                              });
                            } else {
                              setUpdatedData({
                                ...updatedData,
                                perksAndBenefits: selectedPerks.filter(
                                  (item) => item !== perk
                                ),
                              });
                            }
                          }}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span>{perk}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Before */}
                <div>
                  <label className="block mb-1 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text py-2 hover:scale-105 transition-transform duration-300 ease-in-out">
                    Apply Before
                  </label>
                  <input
                    type="date"
                    value={updatedData.dueDate || ""}
                    onChange={(e) =>
                      setUpdatedData({
                        ...updatedData,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Card Container */}
            <div className="bg-white rounded-lg p-6 space-y-4 max-w-md">
              {/* Header */}
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>

              {/* Message */}
              <p>
                Are you sure you want to delete this job? This action cannot be
                undone.
              </p>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteJob}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmDelete && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative max-w-lg p-4 mx-auto mt-24">
              <div className="bg-white rounded shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Confirm Delete
                </h2>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this job listing? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 border border-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setShowConfirmDelete(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-red-600 bg-red-50 border border-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    onClick={handleDeleteJob}
                  >
                    Delete Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
