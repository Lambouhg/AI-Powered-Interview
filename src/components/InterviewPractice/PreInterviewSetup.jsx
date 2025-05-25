import React from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem, Box, Button, Switch, FormControlLabel } from '@mui/material';
import { StyledPaper } from './styles';

const PreInterviewSetup = ({ 
  position, 
  isSpeechEnabled, 
  onPositionChange, 
  onSpeechToggle, 
  onStartInterview,
  positionOptions,
  language,
  setLanguage,
  LANGUAGES 
}) => {
  return (
    <StyledPaper elevation={3} sx={{ height: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Chuẩn bị cho buổi phỏng vấn
      </Typography>
      <Typography paragraph>
        Bạn sẽ tham gia một buổi phỏng vấn mô phỏng với AI đóng vai trò là một nhà tuyển dụng.
        Hãy chọn vị trí công việc và ngôn ngữ phỏng vấn để bắt đầu.
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Vị trí ứng tuyển</InputLabel>
        <Select
          value={position}
          label="Vị trí ứng tuyển"
          onChange={onPositionChange}
        >
          {positionOptions.map((pos) => (
            <MenuItem key={pos} value={pos}>
              {pos}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Ngôn ngữ phỏng vấn</InputLabel>
        <Select
          value={language}
          label="Ngôn ngữ phỏng vấn"
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <MenuItem key={lang.key} value={lang.value}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={isSpeechEnabled}
              onChange={onSpeechToggle}
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
        onClick={onStartInterview}
      >
        Bắt đầu phỏng vấn
      </Button>
    </StyledPaper>
  );
};

export default PreInterviewSetup;
