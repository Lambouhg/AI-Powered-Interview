"use client";
import DashboardHeader from "../../components/DashboardHeader";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
//import Image from "next/image";
//import img1 from "../../assets/image.png";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [applications, setApplications] = useState([]); // Danh sách ứng tuyển
  const [stats, setStats] = useState({ totalApplied: 0, interviewed: 0 }); // Thống kê

  // Hiệu ứng chuyển hướng khi chưa đăng nhập
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/"); // Chuyển hướng về trang chủ nếu chưa đăng nhập
    }
  }, [isLoaded, user, router]);

  // Lấy số lượng thông báo chưa đọc
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      try {
        const response = await axios.get("/api/calender/count-unread");
        setNotificationCount(response.data.count);
      } catch (error) {
        console.error("Lỗi lấy số lượng thông báo:", error);
      }
    };
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  // Lấy danh sách thông báo chi tiết khi mở modal
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !showNotification) return;
      try {
        const response = await axios.get("/api/calender/get-notifications");
        setNotificationsList(response.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách thông báo:", error);
      }
    };
    if (showNotification) {
      fetchNotifications();
    }
  }, [user, showNotification]);

  // Lấy lịch phỏng vấn hôm nay
  useEffect(() => {
    const fetchTodayInterviews = async () => {
      if (!user) return;
      try {
        const response = await axios.get("/api/calender/get-upcoming");
        setUpcomingInterviews(response.data);
      } catch (error) {
        console.error("Lỗi lấy lịch phỏng vấn:", error);
      }
    };
    if (user) {
      fetchTodayInterviews();
    }
  }, [user]);

  // Lấy danh sách ứng tuyển từ API
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      try {
        const response = await axios.get("/api/user/apply");
        const apps = response.data.applications;
        setApplications(apps);

        // Tính toán thống kê
        const totalApplied = apps.length;
        const interviewed = apps.filter(
          (app) => app.status === "Shortlisted" || app.status === "Hired"
        ).length;
        setStats({ totalApplied, interviewed });
      } catch (error) {
        console.log(error)
      }
    };
    if (user) {
      fetchApplications();
    }
  }, [user]);

  // Xử lý đánh dấu đã đọc và mở modal thông báo
  const toggleNotification = async () => {
    setShowNotification(!showNotification);
    if (showNotification) {
      try {
        await axios.post("/api/calender/mark-as-read");
        setNotificationCount(0);
        setNotificationsList(
          notificationsList.map((n) => ({ ...n, read: true }))
        );
      } catch (error) {
        console.error("Lỗi đánh dấu đã đọc:", error);
      }
    }
  };

  // Xử lý click vào thông báo
  const handleNotificationClick = (notification) => {
    // Đánh dấu thông báo đã đọc
    const updatedNotifications = notificationsList.map((n) =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotificationsList(updatedNotifications);

    // Giảm số lượng thông báo chưa đọc nếu thông báo chưa đọc trước đó
    if (!notification.read) {
      setNotificationCount(notificationCount - 1);
    }

    // Chuyển sang xem chi tiết
    setSelectedNotification(notification);
  };

  // Xử lý xóa thông báo
  const handleDeleteNotification = async (notificationToDelete) => {
    // Loại bỏ thông báo khỏi danh sách
    const updatedNotifications = notificationsList.filter(
      (n) => n.id !== notificationToDelete.id
    );
    setNotificationsList(updatedNotifications);

    // Giảm số lượng thông báo chưa đọc nếu thông báo chưa đọc trước đó
    if (!notificationToDelete.read) {
      setNotificationCount(notificationCount - 1);
    }

    // Fetch lại danh sách thông báo từ API
    try {
      const response = await axios.get("/api/calender/get-notifications");
      setNotificationsList(response.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách thông báo:", error);
    }
  };

  // Xử lý click vào lịch phỏng vấn
  const handleInterviewClick = (interview) => {
    setSelectedInterview(interview);
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen w-full overflow-hidden relative">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} className="h-full" />
      <div className="w-full overflow-y-auto md:h-screen pb-10">
        <main className="flex-1">
          <div className="w-full mt-6 px-4 border-b-2 border-gray-200 mb-12">
            <DashboardHeader dashboardHeaderName={"Dashboard"} />
          </div>
          <div className="ml-4 md:ml-6 mr-4 md:mr-6">
            <h1 className="text-xl font-bold mt-5">
              Welcome back, {user?.fullName || "User"}!
            </h1>
            <p className="text-gray-600">
              Here is what is happening with your job search applications from
              today.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
              <div className="flex flex-col gap-y-4 md:gap-y-16">
                <StatCard
                  title="Total Jobs Applied"
                  value={stats.totalApplied}
                />
                <StatCard title="Interviewed" value={stats.interviewed} />
              </div>
              <CardChart
                title="Jobs Applied Status"
                data={[
                  stats.totalApplied - stats.interviewed,
                  stats.interviewed,
                ]}
                className="col-span-1 md:col-span-1"
              />
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center justify-between border-b-2 border-blue-50 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Upcoming Interviews
                  </h2>
                  <span className="text-gray-400 text-sm">
                    {new Date().toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Today</h3>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">
                      No interviews scheduled for today
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div
                        key={interview._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group"
                        onClick={() => handleInterviewClick(interview)}
                      >
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 relative">
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-white"></div>
                          <p className="text-base font-semibold text-white">
                            {interview.title}
                          </p>
                          <p className="text-sm text-blue-100 opacity-80 mt-1">
                            {interview.time || "Unknown time"} •{" "}
                            {interview.date ||
                              interview.location ||
                              "Unknown location"}
                          </p>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <p className="text-sm text-gray-700">
                              {interview.location}
                            </p>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedInterview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                    <div className="bg-blue-600 text-white p-6">
                      <h3 className="text-xl font-bold">
                        {selectedInterview.title}
                      </h3>
                      <p className="text-sm text-blue-100 mt-1">
                        {`${selectedInterview.time} ${selectedInterview.date}`}
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Location:
                        </p>
                        <p className="text-gray-600">
                          {selectedInterview.location || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Description:
                        </p>
                        <p className="text-gray-600">
                          {selectedInterview.description ||
                            "No additional details"}
                        </p>
                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          onClick={() => setSelectedInterview(null)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">
                Recent Applications History
              </h3>
              <div className="border rounded-lg shadow-sm">
                <div className="p-0">
                  <div className="divide-y">
                    {applications.slice(0, 3).map(
                      (
                        app // Chỉ hiển thị 3 ứng tuyển gần nhất
                      ) => (
                        <div
                          key={app._id}
                          className="p-4 flex flex-col md:grid md:grid-cols-2 gap-4 items-center justify-between"
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={app.companyID?.logo || img1}
                                className="w-full h-full object-cover"
                                alt={app.jobID?.title || "Job"}
                                onError={(e) => (e.target.src = img1)} // Thay thế bằng ảnh mặc định nếu lỗi
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {app.jobID?.title || "Unknown Role"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {app.companyID?.name || "Unknown Company"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full space-y-2 md:space-y-0">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Date Applied
                              </p>
                              <p className="text-sm">
                                {app.createdAt
                                  ? new Date(app.createdAt).toLocaleDateString()
                                  : "Unknown date"}
                              </p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-sm ${app.status === "Hired"
                                ? "bg-green-50 text-green-600"
                                : app.status === "Rejected"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-orange-50 text-orange-500"
                                }`}
                            >
                              {app.status || "Unknown status"}
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-full" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  className="text-blue-700 hover:underline"
                  onClick={() => router.push("/UserMyApplication")}
                >
                  View all applications history →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Nút thông báo */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleNotification}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition duration-200 focus:outline-none relative"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 15.2V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v4.2c0 .399-.158.78-.405 1.06L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
      </div>

      {/* Modal thông báo */}
      {showNotification && (
        <div className="fixed top-12 right-6 w-96 bg-white border rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-50 p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-800">Thông Báo</h3>
              <button
                onClick={() => setShowNotification(false)}
                className="text-blue-500 hover:text-blue-700"
              >
                {/* Icon đóng */}
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notificationsList.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                Chưa có thông báo mới
              </div>
            )}
            {notificationsList.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition duration-200 
                ${notification.read ? "bg-gray-100" : "bg-blue-50/20"}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full 
                    ${notification.read ? "bg-gray-300" : "bg-blue-500"}`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {notification.title ||
                        notification.message ||
                        "No title available"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {`${notification.date} ${notification.time}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotification(notification);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup chi tiết thông báo */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden border border-gray-200 relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300 rounded-full p-2 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 pb-8 relative">
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-3xl"></div>
              <h3 className="text-2xl font-bold mb-1">
                {selectedNotification.title}
              </h3>
              <p className="text-sm text-blue-100 opacity-80">
                {`${selectedNotification.time} • ${selectedNotification.date}`}
              </p>
            </div>
            <div className="p-6 pt-4 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-3 border border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </p>
                  <p className="text-gray-600">
                    {selectedNotification.location || "Location not specified"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-3 border border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </p>
                  <p className="text-gray-600">
                    {selectedNotification.description ||
                      "No additional details available"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <span>Close</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer w-full h-full">
      <h3 className="text-xl font-semibold">{title}</h3>
      {children || <p className="text-5xl font-bold">{value}</p>}
    </div>
  );
}

function CardChart({ title, data }) {
  const router = useRouter();

  const chartData = {
    labels: ["Unsuitable", "Interviewed"],
    datasets: [
      {
        data: data,
        backgroundColor: ["#2563eb", "#d1d5db"],
        hoverBackgroundColor: ["#1e40af", "#9ca3af"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    animation: { animateRotate: true, animateScale: true },
  };

  const handleViewAllApplications = (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>
    router.push("/UserMyApplication"); // Điều hướng đến trang UserMyApplication
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-xl font-semibold mb-5">{title}</h3>
      <div className="relative w-36 h-36 mx-auto">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
          {data[0] + data[1] > 0
            ? `${Math.round((data[1] / (data[0] + data[1])) * 100)}%`
            : "No Data"}
        </div>
      </div>
      <div className="flex justify-center gap-5 mt-5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
          <p>Unsuitable</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
          <p>Interviewed</p>
        </div>
      </div>
      <a
        className="text-blue-800 font-semibold mt-5 inline-block cursor-pointer hover:underline"
        onClick={handleViewAllApplications} // Thêm sự kiện onClick
      >
        View All Applications {"->"}
      </a>
    </div>
  );
}
