import React from "react";
import { FileText, Users, Star, Award, Clock } from "lucide-react";

const JobDescription = ({ jobData, setJobData }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Job Description</h2>

      {/* Job Description */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <FileText className="w-4 h-4 mr-2 text-blue-600" />
          Job Description <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={jobData.jobDescription}
          onChange={(e) => setJobData({ ...jobData, jobDescription: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-32"
          placeholder="Provide a detailed description of the job position, including its purpose, scope, and role in the company..."
          required
        />
        {jobData.jobDescription?.trim() === "" && (
          <div className="text-red-500 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Please enter the job description
          </div>
        )}
      </div>

      {/* Responsibilities */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Users className="w-4 h-4 mr-2 text-blue-600" />
          Job Responsibilities <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={jobData.responsibilities}
          onChange={(e) => setJobData({ ...jobData, responsibilities: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-32"
          placeholder="List the main responsibilities the candidate will be responsible for..."
          required
        />
        {jobData.responsibilities?.trim() === "" && (
          <div className="text-red-500 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Please enter job responsibilities
          </div>
        )}
      </div>

      {/* Who You Are */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Award className="w-4 h-4 mr-2 text-blue-600" />
          Candidate Requirements <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={jobData.whoYouAre}
          onChange={(e) => setJobData({ ...jobData, whoYouAre: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-32"
          placeholder="Describe the ideal candidate for this position, including required experience, personality traits, and skills..."
          required
        />
        {jobData.whoYouAre?.trim() === "" && (
          <div className="text-red-500 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Please enter candidate requirements
          </div>
        )}
      </div>

      {/* Nice to Haves */}
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium">
          <Star className="w-4 h-4 mr-2 text-blue-600" />
          Preferred Qualifications
        </label>
        <textarea
          value={jobData.niceToHaves}
          onChange={(e) => setJobData({ ...jobData, niceToHaves: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-32"
          placeholder="Additional skills or experience that would make a candidate stand out..."
        />
      </div>

      <div className="pt-2 text-sm text-gray-500 italic flex items-center">
        <Clock className="w-4 h-4 mr-1" />
        <span>Fields marked with <span className="text-red-500">*</span> are required</span>
      </div>
    </div>
  );
};

export default JobDescription;
