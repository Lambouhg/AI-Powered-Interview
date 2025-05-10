// src/components/InterviewPractice/InterviewSession/EvaluationResult.jsx
import React from 'react';

const EvaluationResult = ({ evaluation, onNext }) => {
  const { score, feedback, suggestions } = evaluation;

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Evaluation</h3>
          <span className="text-2xl font-bold text-blue-600">{score}/10</span>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Feedback:</h4>
            <p className="text-gray-600">{feedback}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Suggestions for Improvement:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-600">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button
        onClick={onNext}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Next Question
      </button>
    </div>
  );
};

export default EvaluationResult;