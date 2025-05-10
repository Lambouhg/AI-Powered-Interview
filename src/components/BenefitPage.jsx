"use client";
import React, { useState } from "react";
import {
  Gift,
  Plus,
  Heart,
  Sun,
  Coffee,
  Clock,
  DollarSign,
  Compass,
  CheckCircle,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const BenefitsPage = ({ jobData, setJobData }) => {
  // Complete list of common benefits (updated to match the model's enum values)
  const benefitCategories = [
    {
      title: "Health & Wellness",
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      perks: [
        "Comprehensive Health Insurance",
        "Dental Insurance",
        "Vision Insurance",
        "Life Insurance",
        "Gym Membership",
      ],
    },
    {
      title: "Time Off",
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      perks: [
        "Unlimited Paid Time Off",
        "Paid Vacation",
        "Flexible Work Schedule",
        "Personal Days",
        "Paid Sick Leave",
      ],
    },
    {
      title: "Growth & Development",
      icon: <Compass className="w-5 h-5 text-blue-500" />,
      perks: [
        "Skill Training",
        "Tuition Assistance",
        "Professional Development",
        "Career Mentorship",
        "Internal Promotion",
      ],
    },
    {
      title: "Office & Work Environment",
      icon: <Coffee className="w-5 h-5 text-orange-500" />,
      perks: [
        "Free Meals",
        "Modern Workspace",
        "Standing Desks",
        "Team Building Events",
        "Pet-Friendly Office",
      ],
    },
    {
      title: "Financial Benefits",
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      perks: [
        "Performance Bonus",
        "Company Stock Options",
        "Retirement Savings Plan",
        "Profit Sharing",
        "Commuter Benefits",
      ],
    },
    {
      title: "Legacy Benefits",
      icon: <Gift className="w-5 h-5 text-purple-500" />,
      perks: ["Full Healthcare", "Unlimited Vacation", "Skill Development"],
    },
  ];

  // State for custom benefit
  const [customBenefit, setCustomBenefit] = useState("");

  // Function to add custom benefit
  const addCustomBenefit = () => {
    if (
      customBenefit.trim() !== "" &&
      !jobData.perksAndBenefits.includes(customBenefit.trim())
    ) {
      setJobData({
        ...jobData,
        perksAndBenefits: [...jobData.perksAndBenefits, customBenefit.trim()],
      });
      setCustomBenefit("");
    }
  };

  // Function to check if a benefit is selected
  const isBenefitSelected = (perk) => {
    return jobData.perksAndBenefits.includes(perk);
  };

  // Function to toggle benefit selection
  const toggleBenefit = (perk) => {
    setJobData({
      ...jobData,
      perksAndBenefits: isBenefitSelected(perk)
        ? jobData.perksAndBenefits.filter((p) => p !== perk)
        : [...jobData.perksAndBenefits, perk],
    });
  };

  // Function to remove benefit
  const removeBenefit = (perk) => {
    setJobData({
      ...jobData,
      perksAndBenefits: jobData.perksAndBenefits.filter((p) => p !== perk),
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Benefits & Perks</h2>

      {/* Selected benefits */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Gift className="w-4 h-4 mr-2 text-blue-600" />
          Selected Benefits
        </label>

        {jobData.perksAndBenefits.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {jobData.perksAndBenefits.map((perk, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>{perk}</span>
                <button
                  onClick={() => removeBenefit(perk)}
                  className="ml-2 text-blue-800 hover:text-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-gray-500 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
            No benefits selected yet. Add from the list below or create a custom
            benefit.
          </div>
        )}
      </div>

      {/* Add custom benefit */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Plus className="w-4 h-4 mr-2 text-blue-600" />
          Add Custom Benefit
        </label>
        <div className="flex">
          <input
            type="text"
            value={customBenefit}
            onChange={(e) => setCustomBenefit(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomBenefit()}
            className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter a benefit and press Enter or Add button"
          />
          <button
            onClick={addCustomBenefit}
            className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-all duration-200"
          >
            Add
          </button>
        </div>
      </div>

      {/* List of benefits by category */}
      <div className="space-y-6">
        <label className="flex items-center text-gray-700 font-medium">
          <Gift className="w-4 h-4 mr-2 text-blue-600" />
          Choose from common benefits
        </label>

        {benefitCategories.map((category, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center space-x-2">
              {category.icon}
              <h3 className="font-medium text-gray-700">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.perks.map((perk, perkIdx) => (
                <button
                  key={perkIdx}
                  onClick={() => toggleBenefit(perk)}
                  className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
                    isBenefitSelected(perk)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {isBenefitSelected(perk) && (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {perk}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="pt-2 text-sm text-gray-500 italic flex items-center">
        <Clock className="w-4 h-4 mr-1" />
        <span>
          Attractive benefits will help you attract more potential candidates
        </span>
      </div>
    </div>
  );
};

export default BenefitsPage;
