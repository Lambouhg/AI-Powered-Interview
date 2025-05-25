import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Container, Typography, Box, Button, Paper, Grid, CircularProgress } from '@mui/material';

// Avatar options based on HeyGen's available avatars
const AVATARS = [
  { avatar_id: "f93ba3fdb7d647aba9d1bc0387323279", name: "Linh" },
];

// Enum trạng thái phiên
const SessionState = {
  INACTIVE: 'inactive',
  CONNECTING: 'connecting',
  CONNECTED: 'connected'
};

// Enum loại người gửi tin nhắn
const MessageSender = {
  USER: 'USER',
  AVATAR: 'AVATAR'
};

// Language options for speech-to-text
const LANGUAGES = [
  { label: "English", value: "en", key: "en" },
  { label: "Chinese", value: "zh", key: "zh" },
  { label: "French", value: "fr", key: "fr" },
  { label: "German", value: "de", key: "de" },
  { label: "Japanese", value: "ja", key: "ja" },
  { label: "Korean", value: "ko", key: "ko" },
  { label: "Spanish", value: "es", key: "es" },
  { label: "Vietnamese", value: "vi", key: "vi" },
];

export default function StreamingAvatarPage() {
  const [avatar, setAvatar] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionState, setSessionState] = useState(SessionState.INACTIVE);
  const [taskType, setTaskType] = useState(null);
  const [inputText, setInputText] = useState('');
  const [avatarId, setAvatarId] = useState(AVATARS[0].avatar_id);
  const [language, setLanguage] = useState('en');
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [stream, setStream] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState('UNKNOWN');
  const [messages, setMessages] = useState([]); // Add messages state
  
  const videoRef = useRef(null);
  const avatarRef = useRef(null);

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
      // Import động SDK và các enum/type
      const mod = await import('@heygen/streaming-avatar');
      const StreamingAvatar = mod.default;
      const TaskType = mod.TaskType;
      const AvatarQuality = mod.AvatarQuality;
      const StreamingEvents = mod.StreamingEvents;
      const VoiceChatTransport = mod.VoiceChatTransport;
      const ConnectionQuality = mod.ConnectionQuality;
      const VoiceEmotion = mod.VoiceEmotion;
      const STTProvider = mod.STTProvider;
      const ElevenLabsModel = mod.ElevenLabsModel;
      
      setTaskType(TaskType);
      
      const newAvatar = new StreamingAvatar({
        token,
        basePath: process.env.NEXT_PUBLIC_BASE_API_URL
      });
        // Thiết lập các event handlers
      newAvatar.on(StreamingEvents.STREAM_READY, handleStreamReady);
      newAvatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected);
      newAvatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
        console.log('Avatar bắt đầu nói');
        setIsAvatarTalking(true);
      });      newAvatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        console.log('Avatar dừng nói');
        setIsAvatarTalking(false);
      });
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
      
      // Import động lấy enum
      const mod = await import('@heygen/streaming-avatar');
      const AvatarQuality = mod.AvatarQuality;
      const VoiceChatTransport = mod.VoiceChatTransport;
      const VoiceEmotion = mod.VoiceEmotion;
      const STTProvider = mod.STTProvider;
      const ElevenLabsModel = mod.ElevenLabsModel;
          // Configure voice based on selected language
      const voiceConfig = {
        en: {
          voiceId: '', // English voice
          model: 'eleven_multilingual_v2'
        },
        vi: {
          voiceId: '9a247a37f3c04e6aa934171998b9659c', // Vietnamese voice
          model: 'eleven_multilingual_v2'
        }
      };

      const currentVoice = voiceConfig[language] || voiceConfig.en;

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
    } catch (error) {
      console.error('Error starting avatar session:', error);
      setSessionState(SessionState.INACTIVE);
    }
  }, [avatarId, language, initAvatar]);
  const startVoiceChat = useCallback(async () => {
    if (!avatar || !sessionId) return;
    
    try {
      setIsListening(true);
      // Nếu SDK yêu cầu sessionId cho phương thức startVoiceChat
      await avatar.startVoiceChat(sessionId);
    } catch (error) {
      console.error('Error starting voice chat:', error);
      setIsListening(false);
    }
  }, [avatar, sessionId]);

  // filepath: d:\AI\AI-powered Interview\AI-Powered-Interview\src\pages\interview-practice\optimized-streaming-avatar.jsx
const stopVoiceChat = useCallback(async () => {
  if (!avatar || !sessionId) return;
  try {
    if (typeof avatar.stopVoiceChat === 'function') {
      await avatar.stopVoiceChat(sessionId);
    } else {
      // Nếu không có hàm, chỉ set lại trạng thái
      setIsListening(false);
      console.warn('avatar.stopVoiceChat is not a function');
    }
  } catch (error) {
    console.error('Error stopping voice chat:', error);
  }
}, [avatar, sessionId]);
  const stopSession = useCallback(async () => {
    if (avatar) {
      try {
        await avatar.stopAvatar();
        setSessionId(null);
        setSessionState(SessionState.INACTIVE);
        setIsAvatarTalking(false);
        if (videoRef.current) videoRef.current.srcObject = null;
        if (setMessages) {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error stopping avatar:', error);
      }
    }
  }, [avatar]);

  // Đơn giản hóa hàm xử lý tin nhắn văn bản
  const handleSendTextMessage = useCallback(async () => {
    if (avatar && inputText.trim() && taskType && sessionId) {
      try {
        await avatar.speak({
          sessionId,
          text: inputText,
          task_type: taskType.REPEAT,
        });
        
        setInputText('');
      } catch (error) {
        console.error('Error sending text message:', error);
      }
    }
  }, [avatar, inputText, taskType, sessionId]);

  // Cleanup resources when component unmounts
  useEffect(() => {
    return () => {
      if (avatarRef.current) {
        avatarRef.current.stopAvatar();
      }
    };
  }, []);

  // Update video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    }
  }, [stream]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Streaming Avatar (HeyGen)
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
          <Box sx={{ position: 'relative', aspectRatio: '16/9' }}>
            {connectionQuality !== 'UNKNOWN' && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  left: 12, 
                  backgroundColor: 'rgba(0,0,0,0.6)', 
                  padding: '4px 10px', 
                  borderRadius: 1,
                  zIndex: 1 
                }}
              >
                <Typography variant="caption">
                  Chất lượng kết nối: {connectionQuality}
                </Typography>
              </Box>
            )}
            
            {sessionState === SessionState.CONNECTED && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  left: connectionQuality !== 'UNKNOWN' ? 200 : 12, 
                  backgroundColor: 'rgba(0,0,0,0.6)', 
                  padding: '4px 10px', 
                  borderRadius: 1,
                  zIndex: 1 
                }}
              >
                <Typography variant="caption">
                  Avatar: {AVATARS.find(a => a.avatar_id === avatarId)?.name || avatarId}
                </Typography>
              </Box>
            )}
            
            {sessionState === SessionState.CONNECTED ? (
              <Button 
                variant="contained"
                color="error"
                size="small"
                onClick={stopSession}
                sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  right: 12, 
                  zIndex: 1
                }}
              >
                Dừng Session
              </Button>
            ) : null}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                backgroundColor: '#000'
              }}
            >
              <track kind="captions" />
            </video>
            
            {sessionState === SessionState.CONNECTING && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.7)'
                }}
              >
                <CircularProgress color="primary" />
                <Typography sx={{ ml: 2 }}>Đang kết nối...</Typography>
              </Box>
            )}
          </Box>
          
          {/* Controls Container */}
          <Box 
            sx={{ 
              p: 2, 
              borderTop: '1px solid #27272a',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {sessionState === SessionState.CONNECTED ? (
              <>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Nhập nội dung avatar sẽ nói..."
                    style={{ 
                      flex: 1, 
                      padding: '8px 12px', 
                      borderRadius: 8, 
                      border: '1px solid #3f3f46',
                      backgroundColor: '#27272a',
                      color: 'white'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendTextMessage();
                      }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSendTextMessage}
                    disabled={!inputText.trim()}
                  >
                    Gửi
                  </Button>
                </Box>
                
                {isAvatarTalking && (
                  <Box 
                    sx={{ 
                      p: 1, 
                      backgroundColor: '#172554', 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 10, 
                        height: 10, 
                        borderRadius: '50%', 
                        backgroundColor: '#3b82f6',
                        animation: 'pulse 1.5s infinite'
                      }}
                    />
                    <Typography variant="caption">
                      Avatar đang nói...
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box>
                    <label htmlFor="avatar-select" style={{ marginRight: 8, color: '#d4d4d8' }}>
                      Chọn nhân vật:
                    </label>
                    <select
                      id="avatar-select"
                      value={avatarId}
                      onChange={e => setAvatarId(e.target.value)}
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: 8, 
                        border: '1px solid #3f3f46',
                        backgroundColor: '#27272a',
                        color: 'white'
                      }}
                    >
                      {AVATARS.map(opt => (
                        <option key={opt.avatar_id} value={opt.avatar_id}>{opt.name}</option>
                      ))}
                    </select>
                  </Box>
                  
                  <Box>
                    <label htmlFor="language-select" style={{ marginRight: 8, color: '#d4d4d8' }}>
                      Ngôn ngữ:
                    </label>
                    <select
                      id="language-select"
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: 8, 
                        border: '1px solid #3f3f46',
                        backgroundColor: '#27272a',
                        color: 'white'
                      }}
                    >
                      {LANGUAGES.map(opt => (
                        <option key={opt.key} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => startSession()}
                  disabled={sessionState !== SessionState.INACTIVE}
                >
                  Bắt đầu Chat
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
        
        <Typography variant="body2" sx={{ mt: 3, color: '#525252' }}>
          * Lưu ý: Bạn cần thay <b>token</b>, <b>avatarId</b> và <b>voiceId</b> bằng thông tin thực tế từ HeyGen dashboard.<br />
          * Xem thêm tại <a href="https://docs.heygen.com/docs/streaming-avatar-sdk" target="_blank" rel="noopener noreferrer">HeyGen Streaming Avatar SDK</a>
        </Typography>
        
        <style jsx global>{`
          @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
        `}</style>
      </Box>
    </Container>
  );
}
