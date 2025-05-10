import React, { useState } from 'react';

const EvaluationResult = ({ evaluation, question, onNext }) => {
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (score) => {
    if (score >= 9) return '🌟';
    if (score >= 7) return '✨';
    if (score >= 5) return '👍';
    return '💪';
  };

  const getProgressColor = (score) => {
    if (score >= 9) return 'bg-green-500';
    if (score >= 7) return 'bg-blue-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Score and Overall Evaluation */}
      <div className="text-center pb-6 border-b">
        <div className={`text-4xl font-bold mb-2 ${getScoreColor(evaluation.score)}`}>
          {getScoreEmoji(evaluation.score)} {evaluation.score}/10
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(evaluation.score)}`}
            style={{ width: `${evaluation.score * 10}%` }}
          />
        </div>
        <p className="text-gray-600">{evaluation.overallEvaluation}</p>
      </div>

      {/* Detailed Feedback */}
      <div className="space-y-6">
        {/* Strong Points */}
        <div>
          <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
            <span className="text-lg">✓</span> Strong Points
          </h4>
          <ul className="space-y-2">
            {evaluation.strongPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-green-500 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div>
          <h4 className="font-medium text-yellow-700 mb-3">Areas for Improvement</h4>
          <ul className="space-y-2">
            {evaluation.missedConcepts.map((concept, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-yellow-500 mt-1">•</span>
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div>
          <h4 className="font-medium text-blue-700 mb-3">Suggestions for Next Time</h4>
          <ul className="space-y-2">
            {evaluation.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-500 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ideal Answer */}
        <div className="pt-4">
          <button
            onClick={() => setShowIdealAnswer(!showIdealAnswer)}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
          >
            {showIdealAnswer ? "Hide" : "Show"} Model Answer
            <svg
              className={`w-4 h-4 transform transition-transform ${showIdealAnswer ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showIdealAnswer && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Model Answer:</h4>
              <p className="text-gray-600 whitespace-pre-line">{question.idealAnswer}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default EvaluationResult;
