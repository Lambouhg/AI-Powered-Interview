import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

export default function StreamingAvatarPage() {
  const [avatar, setAvatar] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [taskType, setTaskType] = useState(null);
  const [inputText, setInputText] = useState('');
  const [avatarId, setAvatarId] = useState('058e99d3b3954c52b0732eb4f1dce0d5');
  const videoRef = useRef(null);

  const avatarOptions = [
    { id: 'Abigail_expressive_2024112501', name: 'Abigail' },
    { id: '4474c1c920c940d49c74f4e0a305dd08', name: 'Avatar 2' },
    // Thêm các avatarId thực tế của bạn ở đây
  ];

  useEffect(() => {
    let avatarInstance = null;
    const run = async () => {
      if (typeof window === 'undefined') return;
      // Lấy token dạng text
      const res = await fetch('/api/heygen-token', { method: 'POST' });
      const token = await res.text();
      // Import động SDK và các enum/type
      const mod = await import('@heygen/streaming-avatar');
      const StreamingAvatar = mod.default || mod.StreamingAvatar;
      const TaskType = mod.TaskType;
      const AvatarQuality = mod.AvatarQuality;
      const StreamingEvents = mod.StreamingEvents;
      setTaskType(TaskType);
      avatarInstance = new StreamingAvatar({ token });
      setAvatar(avatarInstance);
      // Lắng nghe STREAM_READY để gắn srcObject
      avatarInstance.on(StreamingEvents.STREAM_READY, (e) => {
        if (videoRef.current && e.detail) {
          videoRef.current.srcObject = e.detail;
        }
      });
      avatarInstance.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        if (videoRef.current) videoRef.current.srcObject = null;
      });
      // Tạo session mới (không truyền voiceChatTransport, để SDK tự động dùng LiveKit nếu bị ép)
      const sessionData = await avatarInstance.createStartAvatar({
        avatarId,
        quality: AvatarQuality.High,
        video_encoding: 'H264',
        version: 'v2',
        voice: {
          voiceId: '9a247a37f3c04e6aa934171998b9659c',
          rate: 1,
          elevenlabsSettings: {}, // nếu không dùng elevenlabs có thể bỏ dòng này
        }
        // KHÔNG truyền voiceChatTransport, để SDK tự động chọn LiveKit nếu tài khoản bị giới hạn
      });
      setSessionId(sessionData.session_id);
    };
    run();
    return () => {
      if (avatarInstance) avatarInstance.stopAvatar?.();
    };
  }, [avatarId]);

  const handleSpeak = async () => {
    if (avatar && sessionId && taskType) {
      await avatar.speak({
        sessionId,
        text: 'Xin chào, tôi là một avatar 3D',
        task_type: taskType.REPEAT,
      });
    }
  };

  const handleCustomSpeak = async () => {
    if (avatar && sessionId && taskType && inputText.trim()) {
      await avatar.speak({
        sessionId,
        text: inputText,
        task_type: taskType.REPEAT,
      });
    }
  };
  
  const handleStopAvatar = async () => {
    if (avatar) {
      await avatar.stopAvatar();
      setSessionId(null);
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Streaming Avatar (HeyGen)
        </Typography>
        <Box sx={{ mb: 2 }}>
          <label htmlFor="avatar-select">Chọn nhân vật: </label>
          <select
            id="avatar-select"
            value={avatarId}
            onChange={e => setAvatarId(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          >
            {avatarOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleStopAvatar} 
            disabled={!sessionId} 
            sx={{ ml: 2 }}
          >
            Dừng session
          </Button>
        </Box>
        <video
          ref={videoRef}
          autoPlay
          controls
          style={{ width: '100%', height: 480, background: '#000', borderRadius: 8, marginBottom: 16 }}
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Nhập nội dung avatar sẽ nói..."
            style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <Button variant="contained" color="secondary" onClick={handleCustomSpeak} disabled={!sessionId || !inputText.trim()}>
            Avatar nói nội dung
          </Button>
        </Box>
        <Button variant="contained" color="primary" onClick={handleSpeak} disabled={!sessionId} sx={{ mb: 2 }}>
          Cho Avatar nói thử (mặc định)
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          * Bạn cần thay <b>token</b> và <b>avatarName</b> (hoặc avatarId) bằng thông tin thực tế từ HeyGen dashboard.<br />
          * Xem thêm tại <a href="https://docs.heygen.com/docs/streaming-avatar-sdk" target="_blank" rel="noopener noreferrer">HeyGen Streaming Avatar SDK</a>
        </Typography>
      </Box>
    </Container>
  );
}
