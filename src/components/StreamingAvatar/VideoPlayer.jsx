import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const VideoPlayer = ({ 
  videoRef, 
  connectionQuality, 
  sessionState, 
  avatarId,
  avatarName,
  SessionState 
}) => {
  return (
    <Box sx={{ position: 'relative', aspectRatio: '16/9' }}>
      {connectionQuality !== 'UNKNOWN' && (
        <Box sx={{ 
          position: 'absolute', 
          top: 12, 
          left: 12, 
          backgroundColor: 'rgba(0,0,0,0.6)', 
          padding: '4px 10px', 
          borderRadius: 1,
          zIndex: 1 
        }}>
          <Typography variant="caption">
            Chất lượng kết nối: {connectionQuality}
          </Typography>
        </Box>
      )}
      
      {sessionState === SessionState.CONNECTED && (
        <Box sx={{ 
          position: 'absolute', 
          top: 12, 
          left: connectionQuality !== 'UNKNOWN' ? 200 : 12, 
          backgroundColor: 'rgba(0,0,0,0.6)', 
          padding: '4px 10px', 
          borderRadius: 1,
          zIndex: 1 
        }}>
          <Typography variant="caption">
            Avatar: {avatarName || avatarId}
          </Typography>
        </Box>
      )}

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
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)'
        }}>
          <CircularProgress color="primary" />
          <Typography sx={{ ml: 2 }}>Đang kết nối...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;
