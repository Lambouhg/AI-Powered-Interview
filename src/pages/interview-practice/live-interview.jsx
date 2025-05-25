import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@clerk/nextjs';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import PreInterviewSetup from '@/components/InterviewPractice/PreInterviewSetup';
import InterviewChat from '@/components/InterviewPractice/InterviewChat';
import InterviewGuidelines from '@/components/InterviewPractice/InterviewGuidelines';
import { getAIResponse } from '@/services/azureAiService';
import { startSpeechRecognition, stopSpeechRecognition, textToSpeech } from '@/utils/speech/azureSpeechUtils';

const positionOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UX/UI Designer',
  'Product Manager',
  'Data Analyst',
  'DevOps Engineer',
  'Mobile Developer',
  'QA Engineer'
];

const LiveInterview = () => {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [interviewing, setInterviewing] = useState(false);
  const [position, setPosition] = useState('Frontend Developer');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messageListRef = useRef(null);
  
  // Speech states
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('vi-VN');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [speechRecognizer, setSpeechRecognizer] = useState(null);

  useEffect(() => {
    // Check auth
    if (clerkLoaded) {
      if (clerkUser || authUser) {
        setLoading(false);
      } else {
        router.push('/sign-in');
      }
    }
  }, [clerkUser, clerkLoaded, authUser, router]);

  // Message list scroll effect
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [conversation]);

  // Speech handlers
  const startSpeechInteraction = () => {
    if (!isSpeechEnabled) return;
    
    setIsListening(true);
    const recognizer = startSpeechRecognition(
      (text) => {
        if (text.trim()) {
          setMessage(text);
          handleSendMessage();
        }
      },
      (error) => {
        console.error("Speech recognition error:", error);
        setIsListening(false);
      },
      voiceLanguage
    );
    
    setSpeechRecognizer(recognizer);
  };
  
  const stopSpeechInteraction = async () => {
    setIsListening(false);
    if (speechRecognizer) {
      try {
        await stopSpeechRecognition(speechRecognizer);
        setSpeechRecognizer(null);
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
  };
  
  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechInteraction();
    } else {
      startSpeechInteraction();
    }
  };
  
  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
  };
  
  const speakAiResponse = async (text) => {
    if (!isSpeakerOn || !isSpeechEnabled) return;
    
    try {
      setIsAiSpeaking(true);
      await textToSpeech(text, voiceLanguage);
    } catch (error) {
      console.error("Error in text-to-speech:", error);
    } finally {
      setIsAiSpeaking(false);
    }
  };

  const startInterview = () => {
    setInterviewing(true);
    const initialMessage = {
      id: Date.now(),
      sender: 'ai',
      text: `Xin chào! Tôi là AI Interviewer. Hôm nay chúng ta sẽ tiến hành phỏng vấn cho vị trí ${position}. Trước tiên, bạn có thể giới thiệu ngắn gọn về bản thân và kinh nghiệm làm việc của mình không?`,
      timestamp: new Date().toISOString()
    };
    setConversation([initialMessage]);
    
    if (isSpeechEnabled && isSpeakerOn) {
      speakAiResponse(initialMessage.text);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsAiThinking(true);
    
    try {
      const history = conversation.filter(msg => !msg.isTyping && !msg.isError);
      const options = {
        position: position,
        skills: getSkillsForPosition(position)
      };
      
      const response = await getAIResponse(message, history, options);
      
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, aiResponse]);
      
      if (isSpeechEnabled && isSpeakerOn) {
        speakAiResponse(response);
      }
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setConversation(prev => [
        ...prev, 
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
          timestamp: new Date().toISOString(),
          isError: true
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const getSkillsForPosition = (pos) => {
    const skillsMap = {
      'Frontend Developer': 'HTML, CSS, JavaScript, React, UI/UX',
      'Backend Developer': 'Node.js, Express, Python, Databases, API Design',
      'Full Stack Developer': 'Frontend, Backend, Databases, System Architecture',
      'UX/UI Designer': 'Design Principles, UX Research, Figma, Adobe XD',
      'Product Manager': 'Product Strategy, User Research, Agile, Roadmapping',
      'Data Analyst': 'SQL, Excel, Data Visualization, Statistics',
      'DevOps Engineer': 'CI/CD, AWS, Docker, Kubernetes, Monitoring',
      'Mobile Developer': 'React Native, Flutter, iOS, Android',
      'QA Engineer': 'Testing Methodologies, Test Automation, Quality Assurance'
    };
    
    return skillsMap[pos] || 'giao tiếp, giải quyết vấn đề, làm việc nhóm';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Phỏng vấn trực tiếp với AI
        </Typography>
        
        {!interviewing ? (
          <PreInterviewSetup 
            position={position}
            isSpeechEnabled={isSpeechEnabled}
            onPositionChange={(e) => setPosition(e.target.value)}
            onSpeechToggle={() => setIsSpeechEnabled(prev => !prev)}
            onStartInterview={startInterview}
            positionOptions={positionOptions}
          />
        ) : (
          <InterviewChat 
            position={position}
            isSpeechEnabled={isSpeechEnabled}
            voiceLanguage={voiceLanguage}
            isListening={isListening}
            isSpeakerOn={isSpeakerOn}
            isAiSpeaking={isAiSpeaking}
            conversation={conversation}
            message={message}
            isAiThinking={isAiThinking}
            onToggleLanguage={() => setVoiceLanguage(prev => prev === 'vi-VN' ? 'en-US' : 'vi-VN')}
            onToggleSpeechRecognition={toggleSpeechRecognition}
            onToggleSpeaker={toggleSpeaker}
            onSpeechToggle={() => setIsSpeechEnabled(prev => !prev)}
            onMessageChange={(e) => setMessage(e.target.value)}
            onSendMessage={handleSendMessage}
            messageListRef={messageListRef}
            handleKeyPress={handleKeyPress}
          />
        )}

        <InterviewGuidelines />
      </Box>
    </Container>
  );
};

export default LiveInterview;
