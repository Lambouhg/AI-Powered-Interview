/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarked,
} from "react-icons/fa";
import HeaderCompany from "../../components/HeaderCompany";
import Sidebar from "../../components/SidebarCompany";

const CompanyProfile = () => {
  const { user } = useUser();
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (!user?.id) return;

        const response = await fetch(`/api/company?userId=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch company data");
          return;
        }

        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCompanyData();
    }
  }, [user]);

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "facebook":
        return <FaFacebook className="text-lg" />;
      case "twitter":
        return <FaTwitter className="text-lg" />;
      case "linkedin":
        return <FaLinkedin className="text-lg" />;
      case "instagram":
        return <FaInstagram className="text-lg" />;
      case "youtube":
        return <FaYoutube className="text-lg" />;
      default:
        return null;
    }
  };

  const handleProfileSettingsClick = () => {
    router.push("/company/Settings");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 p-6 overflow-y-auto">
          <HeaderCompany />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 p-6 overflow-y-auto">
          <HeaderCompany />
          <div className="flex justify-center items-center h-64">
            <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">
                Bạn chưa tạo hồ sơ công ty
              </h1>
              <p className="text-gray-600 mb-4">
                Hãy tạo hồ sơ công ty để xem nó ở đây.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar chiếm toàn bộ chiều cao */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-6">
          <HeaderCompany />

          {/* Company Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={company.logo || "https://i.imgur.com/6bY8z2N.jpg"}
                  alt="Company logo"
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold break-words">
                    {company.name || "Company Name"}
                  </h1>
                  {company.website && (
                    <a
                      href={company.website}
                      className="text-blue-600 text-sm hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200">
                  Public View
                </button>
                <button
                  onClick={handleProfileSettingsClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
                >
                  Profile Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Company Profile */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
                <div className="text-gray-700 break-words whitespace-pre-wrap">
                  {company.description || "No description provided"}
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Company Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Industry</p>
                    <p className="font-medium break-words">
                      {company.industry || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Company Size</p>
                    <p className="font-medium">
                      {company.employees
                        ? `${company.employees} employees`
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Founded</p>
                    <p className="font-medium">
                      {company.dateFounded
                        ? new Date(company.dateFounded).getFullYear()
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="font-medium break-words">
                      {company.location || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Connect With Us</h2>
                {company.socialLinks &&
                Object.entries(company.socialLinks).some(([url]) => url) ? (
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(company.socialLinks).map(
                      ([platform, url]) => {
                        if (!url) return null;
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition duration-200"
                          >
                            {getSocialIcon(platform)}
                            <span className="capitalize">{platform}</span>
                          </a>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">No social links provided</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Tech Stack */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Tech Stack
                </h2>
                {company.techStack && company.techStack.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {company.techStack.map((tech, index) => {
                      const colorVariants = [
                        "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
                        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
                        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
                        "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
                        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
                        "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
                      ];

                      const techColorMap = {};
                      if (!techColorMap[tech]) {
                        techColorMap[tech] =
                          colorVariants[
                            Math.floor(Math.random() * colorVariants.length)
                          ];
                      }

                      return (
                        <span
                          key={index}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${techColorMap[tech]} transition duration-200`}
                        >
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No tech stack information available
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-gray-600 w-5 h-5" />
                    <div>
                      <p className="text-gray-600 text-sm">Email</p>
                      <p className="font-medium break-words">
                        {company.contact?.email ? (
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                              company.contact.email
                            )}`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {company.contact.email}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-gray-600 w-5 h-5" />
                    <div>
                      <p className="text-gray-600 text-sm">Phone</p>
                      <p className="font-medium">
                        {company.contact?.phone ? (
                          <a
                            href={`tel:${company?.contact?.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {company.contact.phone}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarked className="text-gray-600 w-5 h-5" />
                    <div>
                      <p className="text-gray-600 text-sm">Location</p>
                      <p className="font-medium">
                        {company.location ? (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              company.location
                            )}`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {company.location}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;