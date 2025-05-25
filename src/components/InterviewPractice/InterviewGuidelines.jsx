import React from 'react';
import { Typography, Paper } from '@mui/material';

const InterviewGuidelines = () => {
  return (
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
  );
};

export default InterviewGuidelines;
