// src/components/InterviewPractice/InterviewSession/QuestionDisplay.jsx
import React, { useState } from 'react';

const QuestionDisplay = ({ question, questionNumber, totalQuestions, field, role, level, category, difficulty }) => {
  const [showHints, setShowHints] = useState(false);
  
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case 'intern': return 'bg-gray-100 text-gray-800';
      case 'junior': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'lead': return 'bg-indigo-100 text-indigo-800';
      case 'manager': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex gap-2">
          {level && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(level)}`}>
              {level}
            </span>
          )}
          {difficulty && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          )}
          {category && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {question.question}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded">
              Expected Duration: {question.expectedDuration}
            </span>
            <span>•</span>
            <span>Skills Tested: {question.skillsTested?.join(", ")}</span>
          </div>
        </div>

        {/* Hints and Guidelines */}
        <div className="mt-6">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
          >
            {showHints ? "Hide" : "Show"} Interview Tips
            <svg
              className={`w-4 h-4 transform transition-transform ${showHints ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showHints && (
            <div className="mt-4 space-y-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Key Points to Address:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {question.keyPoints?.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              {question.followUpQuestions?.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Be Prepared for Follow-up Questions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    {question.followUpQuestions.map((q, index) => (
                      <li key={index}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Interview Tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Structure your answer clearly and logically</li>
                  <li>Use specific examples from your experience</li>
                  <li>Focus on demonstrating the listed skills</li>
                  <li>Be concise but thorough</li>
                  <li>Take a moment to organize your thoughts before answering</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;