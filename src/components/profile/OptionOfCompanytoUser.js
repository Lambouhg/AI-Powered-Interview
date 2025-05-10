// components/OptionOfCompanytoUser.js
"use client";
import React, { useState } from "react";

const OptionOfCompanytoUser = ({ role }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    "OPEN FOR OPPORTUNITIES"
  );

  const statuses = [
    { label: "In Review", color: "text-blue-500 bg-blue-100" },
    { label: "Shortlisted", color: "text-blue-500 bg-blue-100" },
    { label: "Interview", color: "text-blue bg-blue-500" },
    { label: "Hired / Declined", color: "text-gray-500 bg-gray-100" },
  ];

  if (role !== "company") {
    return null;
  }

  return (
    <div className="relative inline-block">
      {/* Button */}
      <div
        onClick={() => setShowOptions(!showOptions)}
        className="inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer bg-emerald-50 text-emerald-700"
      >
        {selectedStatus}
      </div>
      {/* Dropdown */}
      {showOptions && (
        <div className="left-0 mt-2 w-auto py-3 bg-white border border-gray-200 rounded-lg shadow-lg flex text-sm">
          {statuses.map((status, index) => (
            <div
              key={index}
              className={`px-4 mx-4 py-2 rounded-md cursor-pointer ${status.color} hover:bg-gray-200`}
              onClick={() => {
                setSelectedStatus(status.label);
                setShowOptions(false);
              }}
            >
              {status.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionOfCompanytoUser;
