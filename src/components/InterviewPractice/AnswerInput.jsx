// src/components/InterviewPractice/InterviewSession/AnswerInput.jsx
import { useState, useEffect, useRef } from 'react';
import { startSpeechRecognition, stopSpeechRecognition } from '@/utils/speech/azureSpeechUtils';

const AnswerInput = ({ onSubmit, isEvaluating }) => {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en-US');
  const recognizerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        stopSpeechRecognition(recognizerRef.current)
          .catch(error => console.error('Error cleaning up speech recognition:', error));
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answer);
  };

  const handleStartRecording = () => {
    setError(null);
    setIsRecording(true);

    recognizerRef.current = startSpeechRecognition(
      (text) => {
        setAnswer(prev => prev + (prev ? ' ' : '') + text);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setError('Error recognizing speech. Please try again.');
        setIsRecording(false);
      },
      language
    );
  };

  const handleStopRecording = async () => {
    if (recognizerRef.current) {
      try {
        await stopSpeechRecognition(recognizerRef.current);
        recognizerRef.current = null;
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recording:', error);
        setError('Error stopping recording. Please try again.');
        // Force cleanup
        recognizerRef.current = null;
        setIsRecording(false);
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en-US' ? 'vi-VN' : 'en-US');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Type your answer here or use voice input..."
            disabled={isEvaluating || isRecording}
          />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={isEvaluating || isRecording}
            >
              {language === 'en-US' ? 'VN' : 'EN'}
            </button>
            <button
              type="button"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`p-2 rounded-full ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
              disabled={isEvaluating}
            >
              {isRecording ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {isRecording 
              ? `Recording in ${language === 'en-US' ? 'English' : 'Vietnamese'}...` 
              : `Click the microphone icon to start voice input in ${language === 'en-US' ? 'English' : 'Vietnamese'}`
            }
          </div>
          <button
            type="submit"
            disabled={!answer.trim() || isEvaluating || isRecording}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerInput;