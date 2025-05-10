"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApplyJobForm from "./ApplyJobForm";
import Pagination from "./FindJobs/Pagination";
import JobFilters from "./FindJobs/JobFilters";
import JobSort from "./FindJobs/JobSort";
import JobSearchBar from "./FindJobs/JobSearchBar";
import JobCards from "./FindJobs/JobCards";

function ListJobSearched() {
  const [allJobs, setAllJobs] = useState([]); // Danh sách tất cả công việc từ API
  const [displayedJobs, setDisplayedJobs] = useState([]); // Công việc hiển thị sau khi lọc/sắp xếp/phân trang
  const [totalJobs, setTotalJobs] = useState(0); // Tổng số công việc sau khi lọc
  const [selectedJobTypes, setSelectedJobTypes] = useState("");
  const [selectedCategories, setSelectedCategories] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch tất cả công việc từ API
  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/job/all");
      const data = await res.json();
      setAllJobs(data.jobs);
      setTotalJobs(data.totalJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Lấy query từ URL khi component mount
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("query");
    if (query) {
      setSearchQuery(decodeURIComponent(query));
    }
    const role = localStorage.getItem("role");
    setUserRole(role);
    fetchJobs();
  }, []);

  // Đếm số lượng công việc theo loại
  const countJobsByType = (type) => {
    return allJobs.filter((job) => job.jobType === type).length;
  };

  // Đếm số lượng công việc theo danh mục
  const countJobsByCategory = (category) => {
    return allJobs.filter((job) => job.categories?.includes(category)).length;
  };

  // Lọc công việc
  const filterJobs = (jobs) => {
    let filtered = [...jobs];

    // Lọc theo status (ví dụ: chỉ lấy "Live")
    filtered = filtered.filter((job) => job.status === "Live");

    // Lọc theo jobType
    if (selectedJobTypes) {
      filtered = filtered.filter((job) => job.jobType === selectedJobTypes);
    }

    // Lọc theo categories
    if (selectedCategories) {
      filtered = filtered.filter((job) =>
        job.categories?.includes(selectedCategories)
      );
    }

    // Lọc theo search query
    if (searchQuery) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Sắp xếp công việc
  const sortJobs = (jobs) => {
    const sortedJobs = [...jobs];
    const directionMultiplier = sortDirection === "desc" ? -1 : 1;

    if (sortOption === "popular") {
      sortedJobs.sort((a, b) => {
        const aRatio = (a.applicants ?? 0) / (a.needs ?? 10);
        const bRatio = (b.applicants ?? 0) / (b.needs ?? 10);
        return directionMultiplier * (bRatio - aRatio);
      });
    } else if (sortOption === "recent") {
      sortedJobs.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const bDate = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return directionMultiplier * (bDate - aDate);
      });
    }
    return sortedJobs;
  };

  // Cập nhật danh sách công việc hiển thị
  useEffect(() => {
    const filteredJobs = filterJobs(allJobs);
    const sortedJobs = sortJobs(filteredJobs);
    const skip = (currentPage - 1) * jobsPerPage;
    const paginatedJobs = sortedJobs.slice(skip, skip + jobsPerPage);
    setDisplayedJobs(paginatedJobs);
    setTotalJobs(filteredJobs.length);
  }, [
    allJobs,
    currentPage,
    selectedJobTypes,
    selectedCategories,
    sortOption,
    sortDirection,
    searchQuery,
  ]);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    fetchJobs();
  }, []);

  const handleJobTypeChange = (jobType) => {
    setSelectedJobTypes(selectedJobTypes === jobType ? "" : jobType);
    setCurrentPage(1);
  };

  const handleCategoriesChange = (category) => {
    setSelectedCategories(selectedCategories === category ? "" : category);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleDirectionChange = (e) => {
    setSortDirection(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedJobTypes("");
    setSelectedCategories("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleOpenApplyForm = (job) => {
    setSelectedJob(job);
    setIsApplyFormOpen(true);
  };

  const handleCloseApplyForm = () => {
    setIsApplyFormOpen(false);
    setSelectedJob(null);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6 mt-6 px-4 md:px-10 max-w-9xl mx-auto">
      <JobSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={() => setCurrentPage(1)}
      />
      <div className="flex flex-col md:flex-row gap-6">
        <JobFilters
          isJobTypeOpen={isJobTypeOpen}
          setIsJobTypeOpen={setIsJobTypeOpen}
          isCategoriesOpen={isCategoriesOpen}
          setIsCategoriesOpen={setIsCategoriesOpen}
          selectedJobTypes={selectedJobTypes}
          handleJobTypeChange={handleJobTypeChange}
          selectedCategories={selectedCategories}
          handleCategoriesChange={handleCategoriesChange}
          countJobsByType={countJobsByType}
          countJobsByCategory={countJobsByCategory}
          handleClearFilters={handleClearFilters}
        />
        <div className="flex-1">
          <JobSort
            totalJobs={totalJobs}
            sortOption={sortOption}
            handleSortChange={handleSortChange}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />

          {/* Danh sách công việc */}
          <JobCards
            jobs={displayedJobs}
            handleOpenApplyForm={handleOpenApplyForm}
          />

          {/* Phân trang */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {selectedJob && (
        <ApplyJobForm
          job={selectedJob}
          isOpen={isApplyFormOpen}
          onClose={handleCloseApplyForm}
        />
      )}
    </div>
  );
}

export default ListJobSearched;
