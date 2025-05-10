import React from "react";
import { ChevronLeft } from "lucide-react"; // Assuming you're using lucide-react

const DashboardHeader = ({ dashboardHeaderName, onBackClick }) => {
  return (
    <div className="flex items-center">
      {onBackClick && (
        <button
          onClick={onBackClick}
          className="md:hidden mr-4 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-2xl font-bold text-gray-800">
        {dashboardHeaderName}
      </h1>
    </div>
  );
};

export default DashboardHeader;
