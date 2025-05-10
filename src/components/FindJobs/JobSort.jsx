import React from "react";
import { Button } from "@/components/ui/button";
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi";

const JobSort = ({
    totalJobs,
    sortOption,
    handleSortChange,
    sortDirection,
    setSortDirection,
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-indigo-700">All Jobs</h2>
                <p className="text-sm text-gray-600 mt-1">Showing {totalJobs} results</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
                <div className="flex items-center gap-2">
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="p-2 pl-3 pr-8 border border-gray-200 rounded-md bg-white text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 appearance-none truncate"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                    </select>
                    <Button
                        onClick={() => setSortDirection(sortDirection === "desc" ? "asc" : "desc")}
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

export default JobSort;