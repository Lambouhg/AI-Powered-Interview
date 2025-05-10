"use client";
import ListJobSearched from "../components/ListJobSearched";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

import { Search, MapPin } from "lucide-react";
import { useState } from "react";

const JobFinderPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex bg-white h-screen w-full overflow-hidden">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <div className=" w-full mt-6 px-4 border-b-2 border-gray-200 mb-12">
          <DashboardHeader dashboardHeaderName={"Find Jobs"} />

          <ListJobSearched />
          {/* Main Content */}
        </div>
      </div>
    </div>
  );
};

export default JobFinderPage;
