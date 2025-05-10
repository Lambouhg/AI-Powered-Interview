"use client";
import React, { useState } from "react";
import img1 from "../assets/image.png";
import Image from "next/image";

function ApplyJobForm({ job, isOpen, onClose }) {
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
      const response = await fetch(`/api/user/apply/${job._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Failed to apply for the job: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-4 bg-gray-50 rounded-t-lg border-b sticky top-0 z-10">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src={job.companyId?.logo || img1}
                className="w-full h-full object-cover"
                alt={job.title}
              />
            </div>
            <div>
              <h1 className="text-gray-700 font-bold ">
                {job.title || "Untitled Job"}
              </h1>
              <p className="text-sm text-gray-600">
                {job.jobType} • {job.companyId?.name || "Unknown JobType"}
              </p>
            </div>
            <button
              className="ml-auto text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Submit your application</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700">
                Full name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700">
                Phone number
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Enter your phone number"
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700">
                Current or previous job title
              </label>
              <input
                type="text"
                name="currentJobTitle"
                placeholder="What is your current or previous job title?"
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.currentJobTitle}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3">LINKS</h3>

              <div className="space-y-1 mb-3">
                <label className="block text-sm font-bold text-gray-700">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinURL"
                  placeholder="Link to your LinkedIn URL"
                  className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.linkedinURL}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolioURL"
                  placeholder="Link to your portfolio URL"
                  className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.portfolioURL}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1 mt-4">
              <label className="block text-sm font-bold text-gray-700">
                Additional information
              </label>
              <div className="border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-indigo-500">
                <textarea
                  name="additionalInfo"
                  placeholder="Add a cover letter or anything else you want to share"
                  className="p-2 w-full rounded-md focus:outline-none min-h-[100px] resize-none"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  maxLength={500}
                />
                <div className="flex items-center p-2 border-t">
                  <div className="flex space-x-2 text-gray-400">
                    <button type="button" className="focus:outline-none">
                      📷
                    </button>
                    <button type="button" className="focus:outline-none">
                      B
                    </button>
                    <button type="button" className="focus:outline-none">
                      I
                    </button>
                    <button type="button" className="focus:outline-none">
                      •
                    </button>
                    <button type="button" className="focus:outline-none">
                      #
                    </button>
                    <button type="button" className="focus:outline-none">
                      🔗
                    </button>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">
                    <span className="ml-2">{charCount}/500</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 mt-4">
              <label className="block text-sm font-bold text-gray-700">
                Resume URL
              </label>
              <input
                type="url"
                name="resume"
                placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.resume}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-200 font-medium"
              >
                Submit Application
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
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
  );
}

export default ApplyJobForm;
