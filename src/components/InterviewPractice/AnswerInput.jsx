// src/components/InterviewPractice/InterviewSession/AnswerInput.jsx
import { useState } from 'react';

const AnswerInput = ({ onSubmit, isEvaluating }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answer);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Type your answer here..."
        disabled={isEvaluating}
      />
      <button
        type="submit"
        disabled={!answer.trim() || isEvaluating}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
      </button>
    </form>
  );
};

export default AnswerInput;