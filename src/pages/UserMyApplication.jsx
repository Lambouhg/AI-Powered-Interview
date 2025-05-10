"use client";
import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

const UserMyApplication = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("All"); // Tab được chọn
  const [isOpen, setIsOpen] = useState(false);
  // Gọi API lấy toàn bộ dữ liệu ứng viên
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/user/apply"); // Đường dẫn API lấy dữ liệu
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json(); // Chuyển đổi dữ liệu nhận được từ JSON
        setApplications(data.applications);
        setFilteredApplications(data.applications); // Lưu dữ liệu ban đầu
      } catch (err) {
        setError("Failed to fetch applications.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Hàm lọc ứng viên theo tab
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    if (tab === "All") {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter((app) => app.status === tab);
      setFilteredApplications(filtered);
    }
  };

  const handleDelete = async (jobId) => {
    if (!jobId) {
      alert("Invalid job ID");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/user/apply/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      // Cập nhật danh sách ứng tuyển sau khi xóa thành công
      setFilteredApplications((prevApplications) =>
        prevApplications.filter((app) => app.jobID?._id !== jobId)
      );

      alert("Application deleted successfully");
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    }
  };

  // Các tabs (số lượng ứng viên theo trạng thái sẽ được tính ở frontend)
  const tabs = [
    { name: "All", count: applications.length },
    {
      name: "In Review",
      count: applications.filter((app) => app.status === "In Review").length,
    },
    {
      name: "In Reviewing",
      count: applications.filter((app) => app.status === "In Reviewing").length,
    },
    {
      name: "Shortlisted",
      count: applications.filter((app) => app.status === "Shortlisted").length,
    },
    {
      name: "Hired",
      count: applications.filter((app) => app.status === "Hired").length,
    },
    {
      name: "Rejected",
      count: applications.filter((app) => app.status === "Rejected").length,
    },
  ];

  return (
    <div className="bg-white flex overflow-hidden rounded-lg shadow-lg w-screen h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full overflow-y-auto pb-6">
        <div className="w-full mt-6 px-4 border-b-2 border-gray-200 mb-12">
          <DashboardHeader dashboardHeaderName={"My Applications"} />
        </div>

        <div className="m-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Keep it up!</h1>
          </div>

          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabChange(tab.name)}
                  className={`pb-4 px-1 ${tab.name === selectedTab
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500"
                    }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Applications List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">Applications History</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-9 pr-3 py-2 border rounded-lg"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border rounded-lg">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            {/* Hiển thị trạng thái tải dữ liệu */}
            {loading ? (
              <p className="text-center text-gray-500">
                Loading applications...
              </p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : filteredApplications.length === 0 ? (
              <p className="text-center text-gray-500">
                No applications found.
              </p>
            ) : (
              <table className="w-full">
                <thead className="text-left text-gray-500 text-sm">
                  <tr>
                    <th className="py-2">#</th>
                    <th>Company Name</th>
                    <th>Role</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => (
                    <tr key={app._id} className="border-t">
                      <td className="py-4">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {app.companyID?.name || "Unknown Company"}
                        </div>
                      </td>
                      <td>{app.jobID?.title || "Unknown Role"}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${app.status === "In Reviewing"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-yellow-50 text-yellow-600"
                            }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(app.jobID?._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMyApplication;
