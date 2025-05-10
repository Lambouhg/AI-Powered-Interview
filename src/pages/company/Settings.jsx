"use client";
import React, { useState, useEffect } from "react";
import {
  Camera,
  Building2,
  Globe,
  FileText,
  Link2,
  Bold,
  Italic,
  List,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import SidebarCompany from "../../components/SidebarCompany";
import HeaderCompany from "../../components/HeaderCompany";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const Settings = () => {
  const { user } = useUser();
  const [company, setCompany] = useState(null);
  const [newTech, setNewTech] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLogoInputVisible, setIsLogoInputVisible] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState("");
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/company`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
          setCompany(null); // Không có dữ liệu công ty
          setErrors("Company not found. Please create one.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }

        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
          setCompany(null);
          setErrors("You have no company, let create one ~");
        } else {
          setCompany(data);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error("Failed to load company data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [user]);
  const handleInputChange = (field, value, subField = null) => {
    if (subField) {
      setCompany((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: value,
        },
      }));
    } else {
      setCompany((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleUpdateCompany = async () => {
    if (!company?._id) {
      toast.error("Company ID not found!");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmUpdate = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/company/${company._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(company),
      });

      if (response.ok) {
        toast.success("Company updated successfully!");
        setTimeout(() => {
          setIsSaving(false);
          setIsModalOpen(false);
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update company");
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("An error occurred while updating the company");
      setIsSaving(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!company?._id) {
      toast.error("Company ID not found!");
      return;
    }

    const confirmDelete = window.confirm("Do you want to delete this company?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/company/${company._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Company deleted successfully!");
        router.push("/company/companydashboard");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("An error occurred while deleting the company");
    }
  };

  const handleAddTech = async () => {
    if (!newTech.trim() || !company?._id) return;

    const updatedTechStack = [...(company.techStack || []), newTech.trim()];
    try {
      const response = await fetch(`/api/company/${company._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techStack: updatedTechStack }),
      });

      if (response.ok) {
        handleInputChange("techStack", updatedTechStack);
        setNewTech("");
        toast.success("Technology added successfully!");
      } else {
        toast.error("Failed to add technology");
      }
    } catch (error) {
      console.error("Error adding technology:", error);
      toast.error("An error occurred while adding technology");
    }
  };

  const handleRemoveTech = async (techToRemove) => {
    if (!company?._id) return;

    const updatedTechStack = company.techStack.filter(
      (tech) => tech !== techToRemove
    );
    try {
      const response = await fetch(`/api/company/${company._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techStack: updatedTechStack }),
      });

      if (response.ok) {
        handleInputChange("techStack", updatedTechStack);
        toast.success("Technology removed successfully!");
      } else {
        toast.error("Failed to remove technology");
      }
    } catch (error) {
      console.error("Error removing technology:", error);
      toast.error("An error occurred while removing technology");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!company) {
    return (
      <div className="flex bg-gray-50 h-screen overflow-y-hidden">
        <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 p-6 overflow-y-auto">
          <HeaderCompany />
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">You have no company</h1>
              <p className="text-gray-600 mb-6">{errors}</p>
              <button
                onClick={() => router.push("/company/CreateCompany")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Company
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <main className="mx-auto h-screen w-screen flex overflow-hidden">
      <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full px-10 pt-5 h-full overflow-y-auto">
        <HeaderCompany />
        <div className="w-full mx-auto py-7">
          <header className="bg-white rounded-2xl shadow-sm mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">OVERVIEW</h1>
            <p className="text-gray-500">
              Manage your company profile and information
            </p>
            <nav className="flex mt-6 space-x-1 bg-gray-100 p-1 rounded-xl">
              <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-white text-blue-600 shadow-sm">
                Overview
              </button>
              <button
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600"
                onClick={() => handleNavigation("/company/SocialsLink")}
              >
                Social Links
              </button>
              <button
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600"
                onClick={() => handleNavigation("/company/CompanyTeam")}
              >
                Team
              </button>
            </nav>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-4">
                  Quick Navigation
                </h2>
                <nav className="flex flex-col space-y-4">
                  <a
                    href="#basic"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Basic Information</span>
                  </a>
                  <a
                    href="#logo"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Company Logo</span>
                  </a>
                  <a
                    href="#details"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Company Details</span>
                  </a>
                  <a
                    href="#about"
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600"
                  >
                    <Globe className="w-5 h-5" />
                    <span>About Company</span>
                  </a>
                </nav>
                <button
                  onClick={handleDeleteCompany}
                  className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Delete Company
                </button>
              </div>
            </aside>

            <div className="lg:col-span-3 space-y-6">
              <section id="logo" className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      Company Logo
                    </h3>
                    <p className="text-gray-500 text-sm">
                      This will be displayed on your public profile
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  {company?.logo ? (
                    <img
                      src={company.logo}
                      alt="Company logo"
                      className="w-24 h-24"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                      {!isLogoInputVisible ? (
                        <button
                          onClick={() => setIsLogoInputVisible(true)}
                          className="flex items-center justify-center w-full py-2 text-gray-600 hover:text-blue-600"
                        >
                          <Camera className="w-6 h-6 mr-2" />
                          <span>Change Logo</span>
                        </button>
                      ) : (
                        <input
                          type="url"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com/logo.png"
                          value={company?.logo || ""}
                          onChange={(e) =>
                            handleInputChange("logo", e.target.value)
                          }
                          onBlur={() => setIsLogoInputVisible(false)}
                          autoFocus // Tự động focus khi input xuất hiện
                        />
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="details"
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Company Details
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={company?.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-600"
                        value={company?.website || ""}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={company?.location || ""}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employees
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={company?.employees || ""}
                        onChange={(e) =>
                          handleInputChange("employees", Number(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={company?.industry || ""}
                        onChange={(e) =>
                          handleInputChange("industry", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Founded
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={
                          company?.dateFounded
                            ? new Date(company.dateFounded)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange("dateFounded", e.target.value)
                        }
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={company?.contact?.email || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "contact",
                              e.target.value,
                              "email"
                            )
                          }
                        />
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={company?.contact?.phone || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "contact",
                              e.target.value,
                              "phone"
                            )
                          }
                        />
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tech Stack
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {company?.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-600"
                        >
                          {tech}
                          <button
                            type="button"
                            className="ml-2 text-purple-400 hover:text-purple-600"
                            onClick={() => handleRemoveTech(tech)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add technology"
                      />
                      <button
                        type="button"
                        onClick={handleAddTech}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
                        disabled={!newTech.trim()}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="about"
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  About Company
                </h3>
                <div className="border rounded-xl overflow-hidden">
                  <div className="flex items-center space-x-2 border-b p-3">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Bold className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Italic className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Link2 className="w-5 h-5" />
                    </button>
                  </div>
                  <textarea
                    className="w-full p-4 min-h-[200px] resize-none border-none focus:ring-0"
                    placeholder="Write about your company..."
                    value={company?.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                  <div className="border-t p-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Markdown supported
                    </span>
                    <span className="text-sm text-gray-500">
                      {company?.description?.length || 0} / 500
                    </span>
                  </div>
                </div>
              </section>

              <div className="flex justify-end space-x-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  onClick={handleUpdateCompany}
                >
                  <span>Save Changes</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {isModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="bg-white rounded-2xl p-6 w-full max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Confirm Changes
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to save these changes to your
                        company profile?
                      </p>
                      <div className="flex justify-end space-x-4">
                        <button
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          onClick={() => setIsModalOpen(false)}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2 ${
                            isSaving
                              ? "opacity-75 cursor-not-allowed"
                              : "hover:bg-blue-700"
                          }`}
                          onClick={confirmUpdate}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <div>
                              <svg
                                className="animate-spin h-5 w-5 text-white"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Saving...
                            </div>
                          ) : (
                            "Confirm"
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
