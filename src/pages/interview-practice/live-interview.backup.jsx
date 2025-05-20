import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Container, Typography, Box, Paper, TextField, Button, 
  Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider,
  FormControl, InputLabel, Select, MenuItem, CircularProgress,
  IconButton, Tooltip, Switch, FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AndroidIcon from '@mui/icons-material/Android';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { getAIResponse } from '@/services/azureAiService';
import { startSpeechRecognition, stopSpeechRecognition, textToSpeech } from '@/utils/speech/azureSpeechUtils';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  height: '60vh',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
}));

const MessageItem = styled(ListItem)(({ theme, sender }) => ({
  flexDirection: 'column',
  alignItems: sender === 'user' ? 'flex-end' : 'flex-start',
  padding: theme.spacing(1),
}));

const MessageContent = styled(Paper)(({ theme, sender }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: sender === 'user' ? theme.palette.primary.light : theme.palette.grey[100],
  color: sender === 'user' ? theme.palette.primary.contrastText : 'inherit',
  borderRadius: theme.spacing(2),
  maxWidth: '80%',
}));

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [interviewing, setInterviewing] = useState(false);
  const [position, setPosition] = useState('Frontend Developer');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messageListRef = useRef(null);
  
  // State cho speech interaction
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false); // Bật/tắt tính năng voice
  const [isListening, setIsListening] = useState(false); // Đang lắng nghe người dùng nói
  const [isAiSpeaking, setIsAiSpeaking] = useState(false); // AI đang nói
  const [voiceLanguage, setVoiceLanguage] = useState('vi-VN'); // Ngôn ngữ nhận diện giọng nói
  const [isSpeakerOn, setIsSpeakerOn] = useState(true); // Bật/tắt loa AI
  const [speechRecognizer, setSpeechRecognizer] = useState(null); // Lưu trữ speech recognizer instance

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    // Tự động cuộn xuống tin nhắn mới nhất
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [conversation]);

  // Khởi tạo nhận diện giọng nói sử dụng Azure Speech Services
  const startSpeechInteraction = () => {
    if (!isSpeechEnabled) return;
    
    setIsListening(true);
    const recognizer = startSpeechRecognition(
      // onResult - khi nhận diện được giọng nói
      (text) => {
        if (text.trim()) {
          setMessage(text);
          // Tự động gửi tin nhắn sau khi nhận diện giọng nói
          handleSendMessage();
        }
      },
      // onError - khi có lỗi
      (error) => {
        console.error("Speech recognition error:", error);
        setIsListening(false);
      },
      voiceLanguage // ngôn ngữ
    );
    
    setSpeechRecognizer(recognizer);
  };
  
  // Dừng nhận diện giọng nói
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
  
  // Bật/tắt chức năng lắng nghe giọng nói
  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechInteraction();
    } else {
      startSpeechInteraction();
    }
  };
  
  // Bật/tắt chức năng loa
  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
  };
  
  // Phát âm phản hồi của AI sử dụng Azure Speech Services
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
    // Gửi tin nhắn chào ban đầu từ AI
    const initialMessage = {
      id: Date.now(),
      sender: 'ai',
      text: `Xin chào! Tôi là AI Interviewer. Hôm nay chúng ta sẽ tiến hành phỏng vấn cho vị trí ${position}. Trước tiên, bạn có thể giới thiệu ngắn gọn về bản thân và kinh nghiệm làm việc của mình không?`,
      timestamp: new Date().toISOString()
    };
    setConversation([initialMessage]);
    
    // Nếu chế độ giọng nói được bật, phát âm tin nhắn chào mừng
    if (isSpeechEnabled && isSpeakerOn) {
      speakAiResponse(initialMessage.text);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Thêm tin nhắn của người dùng vào cuộc trò chuyện
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    
    // Hiển thị trạng thái "đang xử lý" của AI
    setIsAiThinking(true);
    
    try {
      // Tạo danh sách lịch sử cuộc trò chuyện để gửi đến AI
      const history = conversation.filter(msg => !msg.isTyping && !msg.isError);
      
      // Tùy chọn cho cuộc phỏng vấn
      const options = {
        position: position,
        skills: getSkillsForPosition(position)
      };
      
      // Gửi tin nhắn đến Azure AI và nhận phản hồi
      const response = await getAIResponse(message, history, options);
      
      // Thêm phản hồi từ AI
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, aiResponse]);
      
      // Phát âm phản hồi của AI nếu tính năng loa được bật
      if (isSpeechEnabled && isSpeakerOn) {
        speakAiResponse(response);
      }
    } catch (error) {
      console.error('Error communicating with AI:', error);
      // Hiển thị thông báo lỗi
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

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
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
          <StyledPaper elevation={3} sx={{ height: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Chuẩn bị cho buổi phỏng vấn
            </Typography>
            <Typography paragraph>
              Bạn sẽ tham gia một buổi phỏng vấn mô phỏng với AI đóng vai trò là một nhà tuyển dụng.
              Hãy chọn vị trí công việc bạn muốn ứng tuyển để bắt đầu.
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Vị trí ứng tuyển</InputLabel>
              <Select
                value={position}
                label="Vị trí ứng tuyển"
                onChange={handlePositionChange}
              >
                {positionOptions.map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={isSpeechEnabled}
                    onChange={() => setIsSpeechEnabled(prev => !prev)}
                    color="primary"
                  />
                }
                label="Bật tương tác bằng giọng nói"
              />
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={startInterview}
            >
              Bắt đầu phỏng vấn
            </Button>
          </StyledPaper>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Vị trí: {position}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={isSpeechEnabled}
                      onChange={() => setIsSpeechEnabled(prev => !prev)}
                      color="primary"
                    />
                  }
                  label="Tương tác giọng nói"
                />
                
                {isSpeechEnabled && (
                  <>
                    <Tooltip title={isListening ? "Dừng nghe" : "Bắt đầu nghe"}>
                      <IconButton 
                        color={isListening ? "secondary" : "default"} 
                        onClick={toggleSpeechRecognition}
                        disabled={isAiSpeaking}
                      >
                        {isListening ? <MicIcon /> : <MicOffIcon />}
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title={isSpeakerOn ? "Tắt loa" : "Bật loa"}>
                      <IconButton 
                        color={isSpeakerOn ? "primary" : "default"} 
                        onClick={toggleSpeaker}
                      >
                        {isSpeakerOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Box>
            
            <StyledPaper elevation={3}>
              <MessageList ref={messageListRef}>
                {conversation.map((msg) => (
                  <MessageItem key={msg.id} sender={msg.sender}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                      {msg.sender === 'ai' && (
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar sx={{ width: 30, height: 30 }}>
                            <AndroidIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {msg.sender === 'user' ? 'Bạn' : 'AI Interviewer'}
                      </Typography>
                      {msg.sender === 'user' && (
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar sx={{ width: 30, height: 30 }}>
                            <AccountCircleIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                      )}
                    </Box>
                    <MessageContent sender={msg.sender} sx={msg.isError ? { backgroundColor: '#ffebee' } : {}}>
                      <Typography variant="body1">{msg.text}</Typography>
                    </MessageContent>
                  </MessageItem>
                ))}
                
                {isAiThinking && (
                  <MessageItem sender="ai">
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 40 }}>
                        <Avatar sx={{ width: 30, height: 30 }}>
                          <AndroidIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <Typography variant="body2" color="text.secondary">
                        AI Interviewer
                      </Typography>
                    </Box>
                    <MessageContent sender="ai">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={15} sx={{ mr: 1 }} />
                        <Typography variant="body1">Đang suy nghĩ...</Typography>
                      </Box>
                    </MessageContent>
                  </MessageItem>
                )}
              </MessageList>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nhập câu trả lời của bạn..."
                  multiline
                  maxRows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!interviewing || isAiThinking || (isListening && isSpeechEnabled)}
                />
                {isSpeechEnabled && (
                  <Tooltip title={isListening ? "Dừng nghe" : "Nói"}>
                    <IconButton 
                      color={isListening ? "secondary" : "primary"} 
                      sx={{ ml: 1 }}
                      onClick={toggleSpeechRecognition}
                      disabled={isAiThinking || isAiSpeaking}
                    >
                      {isListening ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>
                  </Tooltip>
                )}
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ ml: isSpeechEnabled ? 1 : 2, height: 56 }} 
                  onClick={handleSendMessage}
                  disabled={!interviewing || !message.trim() || isAiThinking}
                >
                  Gửi
                </Button>
              </Box>
            </StyledPaper>
          </>
        )}

        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Hướng dẫn phỏng vấn
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>1. Chuẩn bị:</strong> Chuẩn bị sẵn tóm tắt về kinh nghiệm và kỹ năng liên quan đến vị trí bạn đang ứng tuyển.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>2. Trả lời:</strong> Trả lời rõ ràng và ngắn gọn. Sử dụng cấu trúc STAR (Situation, Task, Action, Result) cho câu trả lời.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>3. Đặt câu hỏi:</strong> Chuẩn bị sẵn câu hỏi về công việc và công ty để thể hiện sự quan tâm.
          </Typography>
          <Typography variant="body2">
            <strong>4. Kết thúc:</strong> Cảm ơn người phỏng vấn và thể hiện sự mong muốn được tiếp tục quá trình tuyển dụng.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LiveInterview;
