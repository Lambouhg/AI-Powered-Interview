"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi";

const CompanySort = ({
  totalCompanies,
  sortOption,
  handleSortChange,
  sortDirection,
  setSortDirection,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      {/* Phần tiêu đề và số lượng công ty */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">
          All Companies
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Showing {totalCompanies} results
        </p>
      </div>

      {/* Phần sắp xếp */}
      <div className="flex items-center gap-3">
        <span className="text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
          Sort by:
        </span>
        <div className="flex items-center gap-2">
          {/* Dropdown chọn cách sắp xếp */}
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="p-2 pl-3 pr-8 border border-gray-200 rounded-md bg-white text-gray-700 
                           focus:ring-indigo-500 focus:border-indigo-500 appearance-none truncate
                           w-full sm:w-auto"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>

          {/* Nút thay đổi thứ tự sắp xếp */}
          <Button
            onClick={() =>
              setSortDirection(sortDirection === "desc" ? "asc" : "desc")
            }
            className="p-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md transition-colors duration-200"
            title={sortDirection === "desc" ? "Descending" : "Ascending"}
          >
            {sortDirection === "desc" ? (
              <FiChevronsDown size={16} />
            ) : (
              <FiChevronsUp size={16} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanySort;
