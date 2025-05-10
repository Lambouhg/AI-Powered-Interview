/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import CompanySidebar from "../components/SidebarCompany";
import Sidebar from "../components/Sidebar";
import SocialLinks from "../components/BrowseCompanies/CompanyDetail/SocialLinks";
import PopupAllJobs from "../components/BrowseCompanies/CompanyDetail/PopupAllJobs";
import OpenJob from "../components/BrowseCompanies/CompanyDetail/OpenJob";
import Profile from "../components/BrowseCompanies/CompanyDetail/Profile";
import Details from "../components/BrowseCompanies/CompanyDetail/Details";
import TechStack from "../components/BrowseCompanies/CompanyDetail/TechStack";
import Contact from "../components/BrowseCompanies/CompanyDetail/Contact";
import { useRouter } from "next/router";

const CompaniesDetail = () => {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

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
    const fetchCompanyData = async () => {
      const { companyId } = router.query;
      if (!companyId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/company/all?id=${companyId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          console.error("Failed to fetch company data:", response.statusText);
          setCompany(null);
          setJobs([]);
          setLoading(false);
          return;
        }
        const companyData = await response.json();
        console.log("Company data received:", companyData); // Debug log

        // Ensure jobs have company data
        const jobsWithCompany = companyData.jobs?.map(job => ({
          ...job,
          companyId: {
            name: companyData.name,
            logo: companyData.logo,
            location: companyData.location
          }
        })) || [];

        setCompany(companyData);
        setJobs(jobsWithCompany);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setCompany(null);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    if (router.isReady) fetchCompanyData();
  }, [router.isReady, router.query]);

  const handleBack = () => router.back();

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const limitedJobs = jobs.slice(0, 4);
  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) {
    return (
      <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {userRole === "company" && (
          <CompanySidebar className="w-[250px] shrink-0" />
        )}
        {userRole === "user" && <Sidebar className="w-[250px] shrink-0" />}
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {userRole === "company" && (
          <CompanySidebar className="w-[250px] shrink-0" />
        )}
        {userRole === "user" && <Sidebar className="w-[250px] shrink-0" />}
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 tracking-wide">
              Company Not Found
            </h1>
            <p className="text-gray-600">
              The company you requested does not exist or has not been created.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {userRole === "company" && (
        <CompanySidebar className="w-[250px] shrink-0" />
      )}
      {userRole === "user" && <Sidebar className="w-[250px] shrink-0" />}
      <div className="overflow-y-auto w-full h-screen pb-10">
        <div className="w-full mt-6 px-4 border-b-2 border-gray-200 mb-12">
          <DashboardHeader
            dashboardHeaderName={"Company Detail"}
            onBack={handleBack}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Company Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={company.logo || "https://www.shutterstock.com/image-vector/no-image-available-icon-vector-260nw-1323742826.jpg"}
                  alt="Company logo"
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-200"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    {company.name || "Company Name"}
                  </h1>
                  {company.website && (
                    <a
                      href={company.website}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {/* Company Profile */}
              <Profile description={company.description} />
              {/* Company Details */}
              <Details
                industry={company.industry}
                employees={company.employees}
                dateFounded={company.dateFounded}
                location={company.location}
              />
              {/* Connect Social*/}
              <SocialLinks socialLinks={company.socialLinks} />

              {/* Open All Jobs */}
              <OpenJob
                company={company}
                limitedJobs={limitedJobs}
                onShowAll={() => {
                  setShowPopup(true);
                  setCurrentPage(1);
                }}
              />

              {/* Popup Modal */}
              <PopupAllJobs
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                jobs={jobs}
                currentJobs={currentJobs}
                company={company}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                jobsPerPage={jobsPerPage}
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              {/* Tech Stack */}
              <TechStack techStack={company.techStack} />

              {/* Contact Information */}
              <Contact contact={company.contact} location={company.location} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesDetail;
