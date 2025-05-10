"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import DasborderHeader from "../../components/HeaderCompany";
import SidebarCompany from "../../components/SidebarCompany";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

const ApplicantList = () => {
  const router = useRouter();
  const { user } = useUser();
  const [role, setRole] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        try {
          const response = await fetch("/api/auth/callback/route");
          const data = await response.json();

          if (data.user?.role) {
            setRole(data.user.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };
      fetchUserRole();
    }
  }, [user]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch("/api/company/applicant");
        const data = await response.json();

        if (data?.applicants && data.applicants.length > 0) {
          setApplicants(data.applicants);
        } else {
          setApplicants([]);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const handleSeeApplication = (applicantId) => {
    router.push(`/company/applicant-details?applicantId=${applicantId}`);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white rounded-lg shadow-sm mx-auto">
      <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="overflow-y-auto w-full p-6">
        <DasborderHeader />

        {/* Header and Search Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="text-lg font-semibold mb-4 md:mb-0">
            Total Applicants : {applicants.length}
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto mb-2 md:mb-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Applicants"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg w-full"
              onClick={toggleMobileFilter}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>

            {/* Desktop Filter Button */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        {isMobileFilterOpen && (
          <div className="md:hidden bg-white border rounded-lg p-4 mb-4 shadow-md">
            {/* Add your mobile filter options here */}
            <p>Mobile Filter Options</p>
          </div>
        )}

        {loading ? (
          <p>Loading applicants...</p>
        ) : applicants.length === 0 ? (
          <p>Chưa có Applicant nào</p>
        ) : (
          <div>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-4 font-medium">
                      <input type="checkbox" className="mr-4" />
                      Full Name{" "}
                      <ChevronDown className="w-4 h-4 inline-block ml-1" />
                    </th>
                    <th className="pb-4 font-medium">
                      Score{" "}
                      <ChevronDown className="w-4 h-4 inline-block ml-1" />
                    </th>
                    <th className="pb-4 font-medium">
                      Hiring Stage{" "}
                      <ChevronDown className="w-4 h-4 inline-block ml-1" />
                    </th>
                    <th className="pb-4 font-medium">
                      Applied Date{" "}
                      <ChevronDown className="w-4 h-4 inline-block ml-1" />
                    </th>
                    <th className="pb-4 font-medium">
                      Job Role{" "}
                      <ChevronDown className="w-4 h-4 inline-block ml-1" />
                    </th>
                    <th className="pb-4 font-medium">
                      Action{" "}
                      <ChevronDown className="w-4 h-4 inline-block ml-1" />
                    </th>
                    <th className="pb-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((applicant) => (
                    <tr
                      key={applicant._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-4">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-4 h-4 w-4" />

                          {applicant.fullName}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">
                            {(applicant.score || 0).toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                          {applicant.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {new Date(applicant.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td className="py-4">
                        {applicant.currentJobTitle || "N/A"}
                      </td>
                      <td className="py-4">
                        <button
                          className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg"
                          onClick={() => handleSeeApplication(applicant._id)}
                        >
                          See Application
                        </button>
                      </td>
                      <td className="py-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {applicants.map((applicant) => (
                <div
                  key={applicant._id}
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                      <span className="font-semibold">
                        {applicant.fullName}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Score:</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">
                          {(applicant.score || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs block w-fit">
                        {applicant.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Applied Date:</span>
                      <p>
                        {new Date(applicant.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Job Role:</span>
                      <p>{applicant.currentJobTitle || "N/A"}</p>
                    </div>
                  </div>

                  <button
                    className="w-full mt-4 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg"
                    onClick={() => handleSeeApplication(applicant._id)}
                  >
                    See Application
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantList;
