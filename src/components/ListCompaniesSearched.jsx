"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./BrowseCompanies/Pagination";
import CompanySort from "./BrowseCompanies/CompanySort";
import CompanyFilters from "./BrowseCompanies/CompanyFilters";
import CompanyCards from "./BrowseCompanies/CompanyCards";
import CompanySearchBar from "./BrowseCompanies/CompanySearchBar";

const ListCompaniesSearched = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("recent");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isIndustryOpen, setIsIndustryOpen] = useState(true);
  const companiesPerPage = 6;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/company/all");
        setCompanies(response.data);
        setLoading(false);
      } catch (err) {
        setError("Lỗi khi tải danh sách công ty");
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const countCompaniesByIndustry = (industryName) => {
    return companies.filter(
      (company) =>
        company.industry &&
        company.industry.toLowerCase() === industryName.toLowerCase()
    ).length;
  };

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(selectedIndustry === industry ? "" : industry);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedIndustry("");
    setCurrentPage(1);
  };

  const filteredAndSortedCompanies = () => {
    let result = [...companies];

    if (searchQuery) {
      result = result.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedIndustry) {
      result = result.filter(
        (company) =>
          company.industry &&
          company.industry.toLowerCase() === selectedIndustry.toLowerCase()
      );
    }

    if (sortOption === "recent") {
      result.sort((a, b) => {
        const aLatestJob =
          a.jobs && a.jobs.length > 0
            ? Math.max(...a.jobs.map((job) => new Date(job.createdAt)))
            : 0;
        const bLatestJob =
          b.jobs && b.jobs.length > 0
            ? Math.max(...b.jobs.map((job) => new Date(job.createdAt)))
            : 0;
        return sortDirection === "desc"
          ? bLatestJob - aLatestJob
          : aLatestJob - bLatestJob;
      });
    } else if (sortOption === "popular") {
      result.sort((a, b) => {
        const aCount = a.jobsCount || 0;
        const bCount = b.jobsCount || 0;
        return sortDirection === "desc" ? bCount - aCount : aCount - bCount;
      });
    }

    return result;
  };

  const allCompanies = filteredAndSortedCompanies();
  const totalPages = Math.ceil(allCompanies.length / companiesPerPage);
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = allCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6 mt-6 px-4 md:px-10 max-w-9xl mx-auto">
      {/* Search bar */}
      <CompanySearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col">
          <div className="flex">
            {/* Bộ lọc ngành */}
            <CompanyFilters
              selectedIndustry={selectedIndustry}
              handleIndustryChange={handleIndustryChange}
              countCompaniesByIndustry={countCompaniesByIndustry}
              isIndustryOpen={isIndustryOpen}
              setIsIndustryOpen={setIsIndustryOpen}
              handleClearFilters={handleClearFilters}
            />

            {/* Nội dung chính */}
            <div className="flex-1 ml-5">
              <CompanySort
                totalCompanies={allCompanies.length}
                sortOption={sortOption}
                handleSortChange={handleSortChange}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              />

              {/* Company Cards */}
              <CompanyCards companies={currentCompanies} />
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCompaniesSearched;
