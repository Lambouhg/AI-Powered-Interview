"use client";
import React, { useState } from "react";
import JobInformationCompany from "../../components/JobInformationCompany";
import SidebarCompany from "../../components/SidebarCompany";
import HeaderCompany from "../../components/HeaderCompany";
import JobDescription from "../../components/JobDescription";
import BenefitsPage from "../../components/BenefitPage";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import {
  Briefcase,
  FileText,
  Gift,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostJobCompany = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("JobInformationCompany");
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [jobData, setJobData] = useState({
    title: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    categories: [],
    requiredSkills: [],
    jobDescription: "",
    responsibilities: "",
    whoYouAre: "",
    niceToHaves: "",
    perksAndBenefits: [],
    dueDate: new Date(),
    needs: 0,
  });

  const steps = [
    {
      key: "JobInformationCompany",
      number: 1,
      title: "Job information",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      key: "JobDescription",
      number: 2,
      title: "Job description",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      key: "BenefitsPage",
      number: 3,
      title: "Benefits & Treatment",
      icon: <Gift className="w-5 h-5" />,
    },
  ];

  const handleNext = () => {
    const currentIndex = steps.findIndex((s) => s.key === activeTab);
    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1].key);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex((s) => s.key === activeTab);
    if (currentIndex > 0) {
      setActiveTab(steps[currentIndex - 1].key);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = [
        "title",
        "jobType",
        "salaryMin",
        "salaryMax",
        "categories",
        "requiredSkills",
        "jobDescription",
        "responsibilities",
        "whoYouAre",
        "dueDate",
      ];

      const missingFields = requiredFields.filter((field) => !jobData[field]);
      if (missingFields.length > 0) {
        toast.error(`Thiếu thông tin: ${missingFields.join(", ")}`);
        return;
      }

      // Format data for API
      const formattedData = {
        ...jobData,
        salaryMin: Number(jobData.salaryMin),
        salaryMax: Number(jobData.salaryMax),
        dueDate: jobData.dueDate.toISOString(),
        needs: Number(jobData.needs) || 0,
      };

      // Get authentication token
      const token = await getToken();

      // Show loading toast
      const loadingToast = toast.loading("Creating job posting...");

      // API call
      const response = await fetch("/api/job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      toast.dismiss(loadingToast);

      const data = await response.json();
      if (response.ok) {
        toast.success("Successfully created job posting!");
        setTimeout(() => router.push("/company/JobListingCompany"), 2000);
      } else {
        toast.error(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Unable to create job posting. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 bg-white shadow-sm">
          <HeaderCompany />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Create new job posting
            </h1>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {steps.map((step, index) => (
                  <React.Fragment key={step.key}>
                    {/* Step Circle */}
                    <div
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => setActiveTab(step.key)}
                    >
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200
                        ${
                          activeTab === step.key
                            ? "border-blue-600 bg-blue-600 text-white"
                            : index <
                              steps.findIndex((s) => s.key === activeTab)
                            ? "border-blue-600 bg-blue-100 text-blue-600"
                            : "border-gray-300 bg-white text-gray-400"
                        }`}
                      >
                        {index < steps.findIndex((s) => s.key === activeTab) ? (
                          <Check className="w-6 h-6 text-blue-600" />
                        ) : (
                          step.icon
                        )}
                      </div>

                      {/* Step Title */}
                      <div className="mt-2 text-center">
                        <div
                          className={`text-xs font-medium 
                          ${
                            activeTab === step.key
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          Step {step.number}
                        </div>
                        <div
                          className={`text-sm font-medium 
                          ${
                            activeTab === step.key
                              ? "text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          {step.title}
                        </div>
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="w-24 h-1 sm:w-32 md:w-40 lg:w-56 bg-gray-200 rounded">
                        <div
                          className="h-full bg-blue-600 rounded transition-all duration-300"
                          style={{
                            width:
                              index <
                              steps.findIndex((s) => s.key === activeTab)
                                ? "100%"
                                : "0%",
                          }}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Content Panel */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {activeTab === "JobInformationCompany" && (
                <JobInformationCompany
                  jobData={jobData}
                  setJobData={setJobData}
                />
              )}
              {activeTab === "JobDescription" && (
                <JobDescription jobData={jobData} setJobData={setJobData} />
              )}
              {activeTab === "BenefitsPage" && (
                <BenefitsPage jobData={jobData} setJobData={setJobData} />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 font-medium
                  ${
                    activeTab !== "JobInformationCompany"
                      ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      : "opacity-0 pointer-events-none"
                  }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </button>

              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm"
              >
                {activeTab === "BenefitsPage" ? (
                  <div>
                    Submit
                    <Check className="w-5 h-5 ml-2" />
                  </div>
                ) : (
                  <div>
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PostJobCompany;
