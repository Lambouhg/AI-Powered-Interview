"use client";

import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const CompanyFilters = ({
  selectedIndustry,
  handleIndustryChange,
  countCompaniesByIndustry,
  isIndustryOpen,
  setIsIndustryOpen,
  handleClearFilters,
}) => {
  const industries = [
    "Design",
    "Sales",
    "Marketing",
    "Business",
    "Human Resource",
    "Finance",
    "Engineering",
    "Technology",
  ];

  return (
    <div className="hidden md:block w-72 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <div className="mb-6">
        <div
          className="flex items-center justify-between cursor-pointer py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
          onClick={() => setIsIndustryOpen(!isIndustryOpen)}
        >
          <h3 className="text-xl font-bold text-gray-900">Industry</h3>
          {isIndustryOpen ? (
            <FiChevronUp className="text-gray-600" size={20} />
          ) : (
            <FiChevronDown className="text-gray-600" size={20} />
          )}
        </div>

        {isIndustryOpen && (
          <div className="mt-3 space-y-2 transition-all duration-300">
            {industries.map((industry) => (
              <div
                key={industry}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  name="industry"
                  className="w-5 h-5 accent-indigo-600 focus:ring-indigo-500"
                  checked={selectedIndustry === industry}
                  onChange={() => handleIndustryChange(industry)}
                />
                <label className="flex-1 text-sm font-medium text-gray-700">
                  {industry}{" "}
                  <span className="text-gray-400">
                    ({countCompaniesByIndustry(industry)})
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIndustry && (
        <Button
          onClick={handleClearFilters}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-colors"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default CompanyFilters;
