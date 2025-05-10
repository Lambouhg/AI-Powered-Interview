import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Eye, Mail } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import SidebarCompany from "../../components/SidebarCompany";
import HeaderCompany from "../../components/HeaderCompany";
import { useRouter } from "next/router";

const Analytics = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { job_id } = router.query;

  const handleNavigation = (path) => {
    router.push(path);
  };

  const viewData = [
    { date: "19 Jul", views: 350 },
    { date: "20 Jul", views: 450 },
    { date: "21 Jul", views: 180 },
    { date: "22 Jul", views: 550 },
    { date: "23 Jul", views: 243 },
    { date: "24 Jul", views: 0 },
    { date: "25 Jul", views: 0 },
  ];

  const countryData = [
    { country: "USA", count: 3240, flag: "🇺🇸" },
    { country: "France", count: 3188, flag: "🇫🇷" },
    { country: "Italy", count: 2938, flag: "🇮🇹" },
    { country: "Germany", count: 2624, flag: "🇩🇪" },
    { country: "Japan", count: 2414, flag: "🇯🇵" },
    { country: "Netherlands", count: 1916, flag: "🇳🇱" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarCompany isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 bg-white shadow-sm">
          <HeaderCompany />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                      Social Media Assistant
                    </span>
                  </h1>
                  <p className="text-gray-500">Design • Full-Time • 4 / 11 Hired</p>
                </div>
              </div>
              <button
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2"
              >
                More Action
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <nav className="flex p-1 bg-gray-100 rounded-xl">
                <button
                  className="flex items-center justify-center flex-1 py-3 px-4 rounded-lg font-medium text-gray-600 hover:text-blue-600 transition-all duration-200"
                  onClick={() => handleNavigation(`/company/JobDetails?job_id=${job_id}`)}
                >
                  <span className="flex items-center">Job Details</span>
                </button>
                <button
                  className="flex items-center justify-center flex-1 py-3 px-4 rounded-lg font-medium text-gray-600 hover:text-blue-600 transition-all duration-200"
                  onClick={() => handleNavigation(`/company/ApplicantsTracking?job_id=${job_id}`)}
                >
                  <span className="flex items-center">Applicants</span>
                </button>
                <button className="flex items-center justify-center flex-1 py-3 px-4 rounded-lg font-medium bg-white text-blue-600 shadow-sm transition-all duration-200">
                  <span className="flex items-center">Analytics</span>
                </button>
              </nav>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Views */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600 font-medium">Total Views</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl font-bold text-gray-800">23,564</h2>
                  <span className="text-green-500 text-sm font-medium">6.4% ↑</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">vs last day</p>
              </div>

              {/* Total Applied */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-600 font-medium">Total Applied</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl font-bold text-gray-800">132</h2>
                  <span className="text-red-500 text-sm font-medium">0.4% ↓</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">vs last day</p>
              </div>

              {/* Traffic Channel */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-800">Traffic Channel</h3>
                  <div className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-medium">243</div>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Direct", value: "48%" },
                    { label: "Social", value: "23%" },
                    { label: "Organic", value: "24%" },
                    { label: "Other", value: "5%" },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-medium text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                    Job Listing View Stats
                  </h3>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Last 7 days
                  </button>
                </div>
                <div className="w-full overflow-x-auto">
                  <LineChart width={700} height={300} data={viewData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: "#10B981", strokeWidth: 2 }}
                    />
                  </LineChart>
                </div>
              </div>

              {/* Visitors by Country */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                  Visitors by Country
                </h3>
                <div className="space-y-4">
                  {countryData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.flag}</span>
                        <span className="text-gray-700">{item.country}</span>
                      </div>
                      <span className="font-medium text-gray-800">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;