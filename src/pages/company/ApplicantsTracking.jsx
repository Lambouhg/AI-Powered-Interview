"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  MoreVertical,
  Menu,
  X,
  ArrowLeft,
  FileText,
  Briefcase,
  PieChart,
} from "lucide-react";
import DasborderHeader from "../../components/HeaderCompany";
import SidebarCompany from "../../components/SidebarCompany";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

const ApplicantTracking = () => {
  const router = useRouter();
  const { user } = useUser();
  const { job_id } = router.query;
  const [role, setRole] = useState(null);
  const [applicants, setApplicants] = useState({
    InReview: [],
    Reviewing: [],
    Shortlisted: [],
    Hired: [],
    Rejected: [],
  });
  const [filteredApplicants, setFilteredApplicants] = useState({
    InReview: [],
    Reviewing: [],
    Shortlisted: [],
    Hired: [],
    Rejected: [],
  });
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobNeeds, setJobNeeds] = useState(null); // Thêm state mới cho job.needs
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("pipeline");

  // Fetch user role
  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        try {
          const response = await fetch("/api/auth/callback/route");
          const data = await response.json();
          if (data.user?.role) setRole(data.user.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };
      fetchUserRole();
    }
  }, [user]);

  // Fetch applicant data and job details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicantResponse = await fetch(
          job_id ? `/api/company/applicant?job_id=${job_id}` : "/api/company/applicant"
        );
        const applicantData = await applicantResponse.json();
        if (!applicantResponse.ok) throw new Error(applicantData.message || "Failed to fetch applicants");

        const jobSpecificApplicants = job_id
          ? applicantData.applicants.filter((applicant) => applicant.jobID?._id.toString() === job_id)
          : applicantData.applicants;

        const groupedApplicants = {
          InReview: jobSpecificApplicants.filter((a) => a.status === "In Review"),
          Reviewing: jobSpecificApplicants.filter((a) => a.status === "In Reviewing"),
          Shortlisted: jobSpecificApplicants.filter((a) => a.status === "Shortlisted"),
          Hired: jobSpecificApplicants.filter((a) => a.status === "Hired"),
          Rejected: jobSpecificApplicants.filter((a) => a.status === "Rejected"),
        };
        setApplicants(groupedApplicants);
        setFilteredApplicants(groupedApplicants);

        if (job_id) {
          const jobResponse = await fetch(`/api/job/${job_id}`);
          if (!jobResponse.ok) throw new Error("Failed to fetch job details");
          const jobData = await jobResponse.json();
          setJobType(jobData.job.jobType || "");
          setJobTitle(jobData.job.title || "");
          setJobNeeds(jobData.job.needs || null); // Lấy needs từ job data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [job_id]);

  // Filter applicants based on search term
  useEffect(() => {
    const filterApplicants = () => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = {
        InReview: applicants.InReview.filter((applicant) =>
          applicant.fullName.toLowerCase().includes(lowerSearchTerm)
        ),
        Reviewing: applicants.Reviewing.filter((applicant) =>
          applicant.fullName.toLowerCase().includes(lowerSearchTerm)
        ),
        Shortlisted: applicants.Shortlisted.filter((applicant) =>
          applicant.fullName.toLowerCase().includes(lowerSearchTerm)
        ),
        Hired: applicants.Hired.filter((applicant) =>
          applicant.fullName.toLowerCase().includes(lowerSearchTerm)
        ),
        Rejected: applicants.Rejected.filter((applicant) =>
          applicant.fullName.toLowerCase().includes(lowerSearchTerm)
        ),
      };
      setFilteredApplicants(filtered);
    };
    filterApplicants();
  }, [searchTerm, applicants]);

  const handleSeeApplication = (applicantId) => {
    router.push(`/company/applicant-details?applicantId=${applicantId}`);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const ApplicantCard = ({ fullName, appliedDate, score, _id }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden"></div>
          <div>
            <h3 className="font-semibold text-gray-800">{fullName}</h3>
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => handleSeeApplication(_id)}
            >
              View Profile
            </button>
          </div>
        </div>
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div>
          <div>Applied on</div>
          <div className="font-medium">{new Date(appliedDate).toLocaleDateString("en-GB")}</div>
        </div>
        <div className="text-right">
          <div>Score</div>
          <div className="flex items-center font-medium text-yellow-600">
            <span className="mr-1">★</span>
            {(score || 0).toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { key: "details", label: "Job Details", icon: <FileText className="w-5 h-5" />, path: `/company/JobDetails?job_id=${job_id}` },
    { key: "applicants", label: "Applicants", icon: <Briefcase className="w-5 h-5" />, path: null },
    { key: "analytics", label: "Analytics", icon: <PieChart className="w-5 h-5" />, path: `/company/Analytics?job_id=${job_id}` },
  ];

  const currentTab = "applicants";

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 bg-white shadow-sm">
          <DasborderHeader />
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
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                    {jobTitle || "Loading..."}
                  </span>
                </h1>
                <p className="text-gray-500">
                  {jobType || "Full-Time"} • {filteredApplicants.Hired.length} / {jobNeeds} Hired
                </p>
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

            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-semibold text-gray-800">
                Total Applicants: {Object.values(filteredApplicants).flat().length}
              </div>
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Applicants"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 w-64"
                  />
                </div>
                <div className="flex border rounded-lg overflow-hidden shadow-sm">
                  <button
                    className={`px-4 py-2 font-medium transition-colors ${viewMode === "pipeline"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "hover:bg-gray-100"
                      }`}
                    onClick={() => setViewMode("pipeline")}
                  >
                    Pipeline View
                  </button>
                  <button
                    className={`px-4 py-2 font-medium transition-colors ${viewMode === "table"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "hover:bg-gray-100"
                      }`}
                    onClick={() => setViewMode("table")}
                  >
                    Table View
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : Object.values(filteredApplicants).flat().length === 0 ? (
              <div className="text-center text-gray-500 py-10">No applicants yet.</div>
            ) : viewMode === "pipeline" ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { title: "In Review", data: filteredApplicants.InReview, color: "bg-yellow-400" },
                  { title: "In Reviewing", data: filteredApplicants.Reviewing, color: "bg-blue-600" },
                  { title: "Shortlisted", data: filteredApplicants.Shortlisted, color: "bg-blue-400" },
                  { title: "Hired", data: filteredApplicants.Hired, color: "bg-green-400" },
                  { title: "Rejected", data: filteredApplicants.Rejected, color: "bg-red-500" },
                ].map((section) => (
                  <div key={section.title}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${section.color}`}></div>
                        <span className="font-semibold text-gray-800">{section.title}</span>
                        <span className="text-gray-500">({section.data.length})</span>
                      </div>
                      <MoreVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </div>
                    {section.data.map((applicant) => (
                      <ApplicantCard
                        key={applicant._id}
                        fullName={applicant.fullName}
                        appliedDate={applicant.createdAt}
                        score={applicant.score}
                        _id={applicant._id}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm">
                      <th className="py-3 px-4 text-left">Full Name</th>
                      <th className="py-3 px-4 text-left">Applied Date</th>
                      <th className="py-3 px-4 text-left">Score</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(filteredApplicants)
                      .flat()
                      .map((applicant) => (
                        <tr key={applicant._id} className="border-t hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-800">{applicant.fullName}</td>
                          <td className="py-3 px-4">{new Date(applicant.createdAt).toLocaleDateString("en-GB")}</td>
                          <td className="py-3 px-4">
                            <span className="flex items-center text-yellow-600">
                              <span className="mr-1">★</span>
                              {(applicant.score || 0).toFixed(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${applicant.status === "In Review"
                                ? "bg-yellow-100 text-yellow-800"
                                : applicant.status === "In Reviewing"
                                  ? "bg-blue-100 text-blue-800"
                                  : applicant.status === "Shortlisted"
                                    ? "bg-blue-200 text-blue-800"
                                    : applicant.status === "Hired"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                            >
                              {applicant.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              className="text-blue-600 hover:underline font-medium"
                              onClick={() => handleSeeApplication(applicant._id)}
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantTracking;