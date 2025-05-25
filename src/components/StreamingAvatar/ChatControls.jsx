import React from 'react';
import { Box, Button, Typography, IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

const ChatControls = ({ 
  sessionState, 
  inputText, 
  setInputText, 
  handleSendTextMessage,
  isAvatarTalking,
  SessionState,
  isListening,
  onToggleMic,
  onEndInterview
}) => {
  return (
    <Box sx={{ 
      p: 2, 
      borderTop: '1px solid #27272a',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      {sessionState === SessionState.CONNECTED ? (
        <>          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Nhập nội dung câu trả lời..."
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
            <Tooltip title={isListening ? "Tắt mic" : "Bật mic"}>
              <IconButton
                color={isListening ? "error" : "primary"}
                onClick={onToggleMic}
                disabled={isAvatarTalking}
              >
                {isListening ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
            </Tooltip>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSendTextMessage}
              disabled={!inputText.trim()}
            >
              Gửi
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={onEndInterview}
            >
              Kết thúc phỏng vấn
            </Button>
          </Box>
          
          {isAvatarTalking && (
            <Box sx={{ 
              p: 1, 
              backgroundColor: '#172554', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                backgroundColor: '#3b82f6',
                animation: 'pulse 1.5s infinite'
              }} />
              <Typography variant="caption">
                Avatar đang nói...
              </Typography>
            </Box>
          )}
        </>
      ) : null}
    </Box>
  );
};

export default ChatControls;
