import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@clerk/nextjs';
import { Container, Typography, Box, Paper, CircularProgress } from '@mui/material';
import PreInterviewSetup from '@/components/InterviewPractice/PreInterviewSetup';
import InterviewGuidelines from '@/components/InterviewPractice/InterviewGuidelines';
import { getAIResponse } from '@/services/azureAiService';
import VideoPlayer from '@/components/StreamingAvatar/VideoPlayer';
import ChatControls from '@/components/StreamingAvatar/ChatControls';
import AvatarSetup from '@/components/StreamingAvatar/AvatarSetup';
import { AVATARS, LANGUAGES, SessionState, MessageSender, voiceConfig } from '@/components/StreamingAvatar/HeygenConfig';

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

const AIAvatarInterview = () => {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [interviewing, setInterviewing] = useState(false);
  const [position, setPosition] = useState('Frontend Developer');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechRecognizer, setSpeechRecognizer] = useState(null);
  const [voiceLanguage, setVoiceLanguage] = useState('vi-VN');

  // Avatar states
  const [avatar, setAvatar] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionState, setSessionState] = useState(SessionState.INACTIVE);
  const [taskType, setTaskType] = useState(null);
  const [avatarId, setAvatarId] = useState(AVATARS[0].avatar_id);
  const [language, setLanguage] = useState('en');
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [stream, setStream] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState('UNKNOWN');
  
  const videoRef = useRef(null);
  const avatarRef = useRef(null);
  const messageListRef = useRef(null);

  // Fetch access token and initialize avatar
  const fetchAccessToken = async () => {
    try {
      const response = await fetch('/api/heygen-token', { method: 'POST' });
      const token = await response.text();
      return token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw error;
    }
  };

  const initAvatar = useCallback(async (token) => {
    try {
      const mod = await import('@heygen/streaming-avatar');
      const StreamingAvatar = mod.default;
      const TaskType = mod.TaskType;
      const AvatarQuality = mod.AvatarQuality;
      const StreamingEvents = mod.StreamingEvents;
      
      setTaskType(TaskType);
      
      const newAvatar = new StreamingAvatar({
        token,
        basePath: process.env.NEXT_PUBLIC_BASE_API_URL
      });

      newAvatar.on(StreamingEvents.STREAM_READY, handleStreamReady);
      newAvatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected);
      newAvatar.on(StreamingEvents.AVATAR_START_TALKING, () => setIsAvatarTalking(true));
      newAvatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => setIsAvatarTalking(false));
      newAvatar.on(StreamingEvents.CONNECTION_QUALITY_CHANGED, (e) => setConnectionQuality(e.detail));
      
      avatarRef.current = newAvatar;
      setAvatar(newAvatar);
      return newAvatar;
    } catch (error) {
      console.error('Error initializing avatar:', error);
      throw error;
    }
  }, []);

  const handleStreamReady = useCallback(({ detail }) => {
    if (videoRef.current && detail) {
      videoRef.current.srcObject = detail;
      setStream(detail);
      setSessionState(SessionState.CONNECTED);
    }
  }, []);

  const handleStreamDisconnected = useCallback(() => {
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null);
    setSessionState(SessionState.INACTIVE);
  }, []);

  const startSession = useCallback(async () => {
    try {
      setSessionState(SessionState.CONNECTING);
      
      const token = await fetchAccessToken();
      let avatarInstance = avatarRef.current;
      
      if (!avatarInstance) {
        avatarInstance = await initAvatar(token);
      }
      const mod = await import('@heygen/streaming-avatar');
      const AvatarQuality = mod.AvatarQuality;
      const TaskType = mod.TaskType;
      
      setTaskType(TaskType);

      // Đồng bộ voiceLanguage với language được chọn
      const voiceLangMap = {
        'en': 'en-US',
        'vi': 'vi-VN'
      };
      setVoiceLanguage(voiceLangMap[language] || 'vi-VN');
      
      const currentVoice = voiceConfig[language] || voiceConfig.vi;

      const sessionData = await avatarInstance.createStartAvatar({
        avatarId: avatarId,
        quality: AvatarQuality.Medium,
        video_encoding: 'H264',
        version: 'v2',
        language: language,
        voice: {
          voiceId: currentVoice.voiceId,
          rate: 1,
          elevenlabsSettings: {
            model: currentVoice.model,
            stability: 0.5,
            similarity_boost: 0.75
          },
        }
      });
      
      setSessionId(sessionData.session_id);
      setInterviewing(true);
      
      // Bắt đầu phỏng vấn với tin nhắn chào
      const initialMessage = {
        id: Date.now(),
        sender: 'ai',
        text: language === 'en' 
          ? `Hello! I am an AI Interviewer. Today we will conduct an interview for the ${position} position. First, could you briefly introduce yourself and your work experience?`
          : `Xin chào! Tôi là AI Interviewer. Hôm nay chúng ta sẽ tiến hành phỏng vấn cho vị trí ${position}. Trước tiên, bạn có thể giới thiệu ngắn gọn về bản thân và kinh nghiệm làm việc của mình không?`,
        timestamp: new Date().toISOString()
      };
      setConversation([initialMessage]);

      if (TaskType) {
        await avatarInstance.speak({
          sessionId: sessionData.session_id,
          text: initialMessage.text,
          task_type: TaskType.REPEAT,
        });
      }
      
    } catch (error) {
      console.error('Error starting avatar session:', error);
      setSessionState(SessionState.INACTIVE);
    }
  }, [avatarId, language, initAvatar, position, taskType]);

  const stopSession = useCallback(async () => {
    if (avatar) {
      try {
        await avatar.stopAvatar();
        setSessionId(null);
        setSessionState(SessionState.INACTIVE);
        setIsAvatarTalking(false);
        setMessage('');
        if (videoRef.current) videoRef.current.srcObject = null;
        setStream(null);
        setInterviewing(false);
        setConversation([]);
      } catch (error) {
        console.error('Error stopping avatar:', error);
      }
    }
  }, [avatar]);

  const handleSendMessage = async () => {
    if (!message.trim() || !avatar || !taskType || !sessionId) return;

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
      const history = conversation.filter(msg => !msg.isTyping && !msg.isError);      const options = {
        position: position,
        skills: getSkillsForPosition(position),
        language: language // Thêm ngôn ngữ vào options
      };
      
      // Lấy phản hồi từ AI
      const aiResponse = await getAIResponse(message, history, options);
      
      // Thêm tin nhắn AI vào conversation
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, aiMessage]);
        // Cho avatar nói phản hồi của AI
      const { TaskType } = await import('@heygen/streaming-avatar');
      await avatar.speak({
        sessionId,
        text: aiResponse,
        task_type: TaskType.REPEAT,
      });
      
    } catch (error) {
      console.error('Error in interview:', error);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (avatarRef.current) {
        avatarRef.current.stopAvatar();
      }
    };
  }, []);

  // Auth check
  useEffect(() => {
    if (clerkLoaded) {
      if (clerkUser || authUser) {
        setLoading(false);
      } else {
        router.push('/sign-in');
      }
    }
  }, [clerkUser, clerkLoaded, authUser, router]);

  // Xử lý mic
  const startSpeechInteraction = useCallback(async () => {
    if (!interviewing || isAvatarTalking) return;
    
    const { startSpeechRecognition } = await import('@/utils/speech/azureSpeechUtils');
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
  }, [interviewing, isAvatarTalking, voiceLanguage, handleSendMessage]);

  const stopSpeechInteraction = useCallback(async () => {
    setIsListening(false);
    if (speechRecognizer) {
      const { stopSpeechRecognition } = await import('@/utils/speech/azureSpeechUtils');
      try {
        await stopSpeechRecognition(speechRecognizer);
        setSpeechRecognizer(null);
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
  }, [speechRecognizer]);

  const handleToggleMic = useCallback(async () => {
    if (isListening) {
      await stopSpeechInteraction();
    } else {
      await startSpeechInteraction();
    }
  }, [isListening, startSpeechInteraction, stopSpeechInteraction]);

  const handleEndInterview = useCallback(async () => {
    // Stop any ongoing speech recognition
    if (isListening) {
      await stopSpeechInteraction();
    }
    // Stop the avatar session
    await stopSession();
    // Navigate back to interview practice page
    router.push('/interview-practice');
  }, [isListening, stopSpeechInteraction, stopSession, router]);

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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Phỏng vấn với AI Avatar
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 2, 
            overflow: 'hidden',
            backgroundColor: '#18181b', 
            color: 'white',
            position: 'relative'
          }}
        >
          {/* Video Container */}
          <VideoPlayer 
            videoRef={videoRef}
            connectionQuality={connectionQuality}
            sessionState={sessionState}
            avatarId={avatarId}
            avatarName={AVATARS.find(a => a.avatar_id === avatarId)?.name}
            SessionState={SessionState}
            onStopSession={stopSession}
          />
          
          {/* Controls Container */}
          {!interviewing ? (
            <PreInterviewSetup 
              position={position}
              onPositionChange={(e) => setPosition(e.target.value)}
              onStartInterview={startSession}
              positionOptions={positionOptions}
              avatarId={avatarId}
              setAvatarId={setAvatarId}
              language={language}
              setLanguage={(newLang) => {
                setLanguage(newLang);
                // Cập nhật voiceLanguage khi thay đổi language
                const voiceLangMap = {
                  'en': 'en-US',
                  'vi': 'vi-VN'
                };
                setVoiceLanguage(voiceLangMap[newLang] || 'vi-VN');
              }}
              sessionState={sessionState}
              AVATARS={AVATARS}
              LANGUAGES={LANGUAGES}
              SessionState={SessionState}
            />
          ) : (
            <ChatControls 
              sessionState={sessionState}
              inputText={message}
              setInputText={setMessage}
              handleSendTextMessage={handleSendMessage}
              isAvatarTalking={isAvatarTalking}
              SessionState={SessionState}
              conversation={conversation}
              isListening={isListening}
              onToggleMic={handleToggleMic}
              onEndInterview={handleEndInterview}
            />
          )}
        </Paper>
        
        <InterviewGuidelines />
      </Box>
    </Container>
  );
};

export default AIAvatarInterview;
