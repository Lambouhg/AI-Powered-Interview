import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import QuestionDisplay from '@/components/InterviewPractice/QuestionDisplay';
import AnswerInput from '@/components/InterviewPractice/AnswerInput';
import EvaluationResult from '@/components/InterviewPractice/EvaluationResult';

export default function TestInterviewPractice() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState('setup');
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    role: '',
    level: '',
    category: ''
  });
  const [error, setError] = useState(null);

  const roles = ["Software Developer", "QA Engineer", "Business Analyst", "Project Manager"];
  const levels = ["Intern", "Junior", "Senior", "Lead", "Manager"];
  const categories = ["Technical", "Behavioral", "System Design", "Problem Solving"];

  const handleOptionChange = (field, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartSession = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/interview-practice/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedOptions,
          userId: user?.id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to start session');
      }

      setSession(data);
      setStep('question');
    } catch (error) {
      console.error('Error starting session:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = async (answer) => {
    setIsEvaluating(true);
    setError(null);
    try {
      const response = await fetch('/api/interview-practice/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session._id,
          questionIndex: currentQuestionIndex,
          answer,
          userId: user?.id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to evaluate answer');
      }
      
      setEvaluation(data);
      setStep('evaluation');
    } catch (error) {
      console.error('Error evaluating answer:', error);
      setError(error.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setEvaluation(null);
      setStep('question');
    } else {
      alert('Interview session completed!');
      setStep('setup');
      setSession(null);
      setCurrentQuestionIndex(0);
      setSelectedOptions({
        role: '',
        level: '',
        category: ''
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Interview Practice</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {step === 'setup' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Select Interview Settings</h2>
            <div className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={selectedOptions.role}
                  onChange={(e) => handleOptionChange('role', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Level Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={selectedOptions.level}
                  onChange={(e) => handleOptionChange('level', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Level</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedOptions.category}
                  onChange={(e) => handleOptionChange('category', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleStartSession}
                disabled={isGenerating || !Object.values(selectedOptions).every(Boolean)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isGenerating ? 'Generating Questions...' : 'Start Interview Practice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'question' && session && (
        <div className="space-y-8">
          <QuestionDisplay
            question={session.questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={session.questions.length}
          />
          <AnswerInput
            onSubmit={handleSubmitAnswer}
            isEvaluating={isEvaluating}
          />
        </div>
      )}

      {step === 'evaluation' && evaluation && (
        <EvaluationResult
          evaluation={evaluation}
          question={session.questions[currentQuestionIndex]}
          onNext={handleNext}
        />
      )}
    </div>
  );
}