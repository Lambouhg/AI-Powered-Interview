"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  Briefcase,
  DollarSign,
  Tag,
  Code,
  Users,
  Clock,
} from "lucide-react";

const JobInformationCompany = ({ jobData, setJobData }) => {
  const jobTypes = [
    { value: "Full-Time", label: "Full Time", icon: "🕒" },
    { value: "Part-Time", label: "Part Time", icon: "🕓" },
    { value: "Remote", label: "Remote", icon: "🏠" },
    { value: "Internship", label: "Internship", icon: "🎓" },
    { value: "Contract", label: "Contract", icon: "📝" },
  ];

  const categories = [
    { value: "Tech", label: "Technology", icon: "💻" },
    { value: "Marketing", label: "Marketing", icon: "📊" },
    { value: "Finance", label: "Finance", icon: "💰" },
    { value: "HR", label: "Human Resources", icon: "👥" },
    { value: "Sales", label: "Sales", icon: "🤝" },
  ];

  // Skill input state
  const [skillInput, setSkillInput] = useState("");

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if due date is valid
  const isDueDateInvalid = jobData.dueDate && jobData.dueDate < tomorrow;

  // Handle adding a skill
  const handleAddSkill = () => {
    if (
      skillInput.trim() !== "" &&
      !jobData.requiredSkills.includes(skillInput.trim())
    ) {
      setJobData({
        ...jobData,
        requiredSkills: [...jobData.requiredSkills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skill) => {
    setJobData({
      ...jobData,
      requiredSkills: jobData.requiredSkills.filter((s) => s !== skill),
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Basic information</h2>

      {/* Job Title */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
          Job title <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={jobData.title}
          onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder="For example: Frontend Developer, Marketing Manager..."
          required
        />
        {jobData.title.trim() === "" && (
          <div className="text-red-500 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Please enter job title
          </div>
        )}
      </div>

      {/* Job Type */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
          Job type <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {jobTypes.map((type) => (
            <div
              key={type.value}
              onClick={() => setJobData({ ...jobData, jobType: type.value })}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                jobData.jobType === type.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              <span>{type.label}</span>
            </div>
          ))}
        </div>
        {jobData.jobType === "" && (
          <div className="text-red-500 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Please select job type
          </div>
        )}
      </div>

      {/* Salary Range */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
          Salary (USD) <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="number"
              min={0}
              value={jobData.salaryMin}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setJobData({ ...jobData, salaryMin: value });
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Minimum salary"
              required
            />
            <DollarSign
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-8 h-1 bg-gray-300 rounded"></div>
          </div>
          <div className="flex-1 relative">
            <input
              type="number"
              min={0}
              value={jobData.salaryMax}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setJobData({ ...jobData, salaryMax: value });
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Maximum salary"
              required
            />
            <DollarSign
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>
        {jobData.salaryMin > jobData.salaryMax && jobData.salaryMax > 0 && (
          <div className="text-amber-600 text-sm mt-1 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Minimum wage must be less than or equal to maximum wage
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Tag className="w-4 h-4 mr-2 text-blue-600" />
          Category <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`px-4 py-2 rounded-full flex items-center transition-all duration-200 ${
                jobData.categories.includes(cat.value)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setJobData({
                  ...jobData,
                  categories: jobData.categories.includes(cat.value)
                    ? jobData.categories.filter((c) => c !== cat.value)
                    : [...jobData.categories, cat.value],
                });
              }}
            >
              <span className="mr-1">{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
        {jobData.categories.length === 0 && (
          <div className="text-red-500 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Please select at least one category
          </div>
        )}
      </div>

      {/* Required Skills */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Code className="w-4 h-4 mr-2 text-blue-600" />
          Required skills <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
            className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter the skill and press Enter or the Add button"
          />
          <button
            onClick={handleAddSkill}
            className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-all duration-200"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {jobData.requiredSkills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 text-blue-800 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {jobData.requiredSkills.length === 0 && (
          <div className="text-red-500 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Please add at least one skill
          </div>
        )}
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
          Application deadline <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <DatePicker
            selected={jobData.dueDate}
            onChange={(date) => setJobData({ ...jobData, dueDate: date })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            minDate={tomorrow}
            placeholderText="Choose an expiration date"
            required
          />
          <Calendar
            className="absolute right-3 top-3 text-gray-400"
            size={20}
          />
        </div>
        {isDueDateInvalid && (
          <div className="text-red-500 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Expiration date must be in the future (after today)
          </div>
        )}
      </div>

      {/* Needs */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Users className="w-4 h-4 mr-2 text-blue-600" />
          Number to be recruited
        </label>
        <input
          type="number"
          min={0}
          value={jobData.needs}
          onChange={(e) => {
            const value = Math.max(0, Number(e.target.value));
            setJobData({ ...jobData, needs: value });
          }}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder="Enter the number of candidates needed"
        />
      </div>

      <div className="pt-2 text-sm text-gray-500 italic flex items-center">
        <Clock className="w-4 h-4 mr-1" />
        <span>
          Markup fields <span className="text-red-500">*</span> is required
        </span>
      </div>
    </div>
  );
};

export default JobInformationCompany;
