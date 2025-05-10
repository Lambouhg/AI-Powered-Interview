import React from "react";
import { X } from "lucide-react";
import img1 from "../assets/image.png";
import Image from "next/image";

const JobApplicationPopup = ({ job, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4 relative my-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
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
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Submit your application
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            The following is required and will only be shared with format
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone number
              </label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current of previous job title
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="What's your current/previous job title?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                className="w-full p-2 border rounded-md"
                placeholder="Link to your LinkedIn URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio URL
              </label>
              <input
                type="url"
                className="w-full p-2 border rounded-md"
                placeholder="Link to your portfolio URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional information
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Add a cover letter or anything else you want to share"
              />
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach your resume
              </label>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border rounded-md text-sm flex items-center gap-2 hover:bg-gray-50">
                  <span>📎</span>
                  Attach Resume/CV
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-6"
            >
              Submit Application
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By sending this request you can confirm that you accept our Terms
              of Service and Privacy Policy
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPopup;
