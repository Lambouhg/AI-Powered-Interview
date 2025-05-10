"use client";
import Sidebar from "../../components/SidebarCompany";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState } from "react";
import Link from "next/link";

import HeaderCompany from "../../components/HeaderCompany";
ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function CompanyDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Week");

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Job View",
        data: [122, 34, 56, 78, 90, 45, 67],
        backgroundColor: "#fbbf24",
      },
      {
        label: "Job Applied",
        data: [34, 56, 78, 90, 45, 67, 89],
        backgroundColor: "#6366f1",
      },
    ],
  };

  // Dữ liệu cho thống kê (StatCards)
  const stats = [
    { title: "New candidates to review", value: "76", color: "bg-purple-600" },
    { title: "Schedule for today", value: "3", color: "bg-green-500" },
    { title: "Messages received", value: "24", color: "bg-blue-500" },
  ];

  // Dữ liệu cho job open và applicants summary
  const jobOpenAndApplicantsSummary = {
    jobOpen: {
      title: "Job Open",
      count: 12,
      description: "Jobs Opened",
    },
    applicantsSummary: {
      title: "Applicants Summary",
      count: 67,
      description: "Applicants",
      applicantTypes: [
        { label: "Full Time", value: 45, color: "bg-blue-500" },
        { label: "Internship", value: 32, color: "bg-yellow-500" },
        { label: "Part-Time", value: 24, color: "bg-green-500" },
        { label: "Contract", value: 30, color: "bg-red-500" },
        { label: "Remote", value: 22, color: "bg-purple-500" },
      ],
    },
  };

  // Dữ liệu cho Job Updates
  const jobUpdates = [
    {
      title: "Social Media Assistant",
      location: "Nomad • Paris, France",
      capacity: "5 applied of 10 capacity",
      tags: ["Marketing", "Design"],
    },
    {
      title: "Brand Designer",
      location: "Nomad • Paris, France",
      capacity: "5 applied of 10 capacity",
      tags: ["Business", "Design"],
    },
    {
      title: "Interactive Developer",
      location: "Terraform • Berlin, Germany",
      capacity: "5 applied of 10 capacity",
      tags: ["Marketing", "Design"],
    },
    {
      title: "Product Designer",
      location: "ClassPass • Berlin, Germany",
      capacity: "5 applied of 10 capacity",
      tags: ["Business", "Design"],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 w-screen overflow-hidden">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <HeaderCompany />
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>

        {/* Job Statistics & Applicants Summary in One Row */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Chart Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Job Statistics</h3>
              <div className="flex space-x-4">
                {["Week", "Month", "Year"].map((range) => (
                  <button
                    key={range}
                    className={`px-3 py-1 rounded-lg ${
                      selectedRange === range
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                    onClick={() => setSelectedRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <Bar data={chartData} />
            </div>
          </div>

          {/* Job Open & Applicants Summary */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">
              {jobOpenAndApplicantsSummary.jobOpen.title}
            </h3>
            <div className="mt-4">
              <h3 className="text-7xl font-bold">
                {jobOpenAndApplicantsSummary.jobOpen.count}
              </h3>
              <p className="text-gray-600">
                {jobOpenAndApplicantsSummary.jobOpen.description}
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold">
                {jobOpenAndApplicantsSummary.applicantsSummary.title}
              </h3>
              <div className="mt-4">
                <h3 className="text-7xl font-bold">
                  {jobOpenAndApplicantsSummary.applicantsSummary.count}
                </h3>
                <p className="text-gray-600">
                  {jobOpenAndApplicantsSummary.applicantsSummary.description}
                </p>
                <div className="mt-4">
                  {jobOpenAndApplicantsSummary.applicantsSummary.applicantTypes.map(
                    (applicant, index) => (
                      <ApplicantItem
                        key={index}
                        color={applicant.color}
                        label={applicant.label}
                        value={applicant.value}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Updates */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Job Updates</h3>
            <Link href="/job-updates" className="text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {jobUpdates.map((update, index) => (
              <JobUpdateCard
                key={index}
                title={update.title}
                location={update.location}
                capacity={update.capacity}
                tags={update.tags}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div
      className={`${color} text-white p-6 rounded-lg shadow-md hover:shadow-lg transition`}
    >
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="mt-2">{title}</p>
    </div>
  );
}

function ApplicantItem({ color, label, value }) {
  return (
    <div className="flex items-center mt-2">
      <span className={`w-3 h-3 ${color} rounded-full mr-2`}></span>
      <span className="text-gray-600">
        {label}: {value}
      </span>
    </div>
  );
}

function JobUpdateCard({ title, location, capacity, tags }) {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-gray-600 text-sm">{location}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-600 text-sm mt-4">{capacity}</p>
    </div>
  );
}
