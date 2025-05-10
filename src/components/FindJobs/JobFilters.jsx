import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiChevronUp, FiChevronDown, FiFilter } from "react-icons/fi";

const JobFilters = ({
  isJobTypeOpen,
  setIsJobTypeOpen,
  isCategoriesOpen,
  setIsCategoriesOpen,
  selectedJobTypes,
  handleJobTypeChange,
  selectedCategories,
  handleCategoriesChange,
  countJobsByType,
  countJobsByCategory,
  handleClearFilters,
}) => {
  const jobTypes = [
    "Full-Time",
    "Part-Time",
    "Remote",
    "Internship",
    "Contract",
  ];
  const categories = [
    "Design",
    "Sales",
    "Marketing",
    "Business",
    "Human Resource",
    "Finance",
    "Engineering",
    "Technology",
  ];

  // Trạng thái điều khiển hiển thị filters trên điện thoại
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateScreenSize(); // Gọi 1 lần khi component mount
    window.addEventListener("resize", updateScreenSize); // Theo dõi thay đổi kích thước

    return () => window.removeEventListener("resize", updateScreenSize); // Cleanup khi unmount
  }, []);

  return (
    <div className="w-full md:w-72 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      {/* Nút Toggle Filters (chỉ hiển thị trên điện thoại) */}
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            <FiFilter size={20} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Hiển thị filters nếu isFiltersVisible = true hoặc trên màn hình lớn */}
      {(!isMobile || isFiltersVisible) && (
        <div>
          {/* Type of Employment */}
          <div className="mb-6">
            <div
              className="flex items-center justify-between cursor-pointer py-2 hover:bg-gray-50 rounded-md px-2 transition-colors duration-200"
              onClick={() => setIsJobTypeOpen(!isJobTypeOpen)}
            >
              <h3 className="text-xl font-bold text-gray-900">
                Type of Employment
              </h3>
              {isJobTypeOpen ? (
                <FiChevronUp className="text-gray-600" size={20} />
              ) : (
                <FiChevronDown className="text-gray-600" size={20} />
              )}
            </div>
            {isJobTypeOpen && (
              <div className="space-y-2 mt-3 transition-all duration-300">
                {jobTypes.map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      name="jobType"
                      className="w-5 h-5 accent-indigo-600 focus:ring-indigo-500"
                      checked={selectedJobTypes.includes(type)}
                      onChange={() => handleJobTypeChange(type)}
                    />
                    <label className="text-sm font-medium text-gray-700 flex-1">
                      {type}{" "}
                      <span className="text-gray-400">
                        ({countJobsByType(type)})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div
              className="flex items-center justify-between cursor-pointer py-2 hover:bg-gray-50 rounded-md px-2 transition-colors duration-200"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <h3 className="text-xl font-bold text-gray-900">Categories</h3>
              {isCategoriesOpen ? (
                <FiChevronUp className="text-gray-600" size={20} />
              ) : (
                <FiChevronDown className="text-gray-600" size={20} />
              )}
            </div>
            {isCategoriesOpen && (
              <div className="space-y-2 mt-3 transition-all duration-300">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      name="category"
                      className="w-5 h-5 accent-indigo-600 focus:ring-indigo-500"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoriesChange(category)}
                    />
                    <label className="text-sm font-medium text-gray-700 flex-1">
                      {category}{" "}
                      <span className="text-gray-400">
                        ({countJobsByCategory(category)})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {(selectedJobTypes.length > 0 || selectedCategories.length > 0) && (
            <Button
              onClick={handleClearFilters}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilters;
