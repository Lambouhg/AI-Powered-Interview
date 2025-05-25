import React from 'react';
import { Box, Button } from '@mui/material';
import { voiceConfig } from './HeygenConfig';

const AvatarSetup = ({ 
  avatarId, 
  setAvatarId, 
  language, 
  setLanguage,
  startSession,
  sessionState,
  AVATARS,
  LANGUAGES,
  SessionState 
}) => {
  return (
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
          </label>          <select
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
            {LANGUAGES.filter(lang => voiceConfig[lang.value]) // Only show languages with voice config
              .map(opt => (
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
  );
};

export default AvatarSetup;
