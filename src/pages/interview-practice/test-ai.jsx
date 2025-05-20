import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';

const TestAzureAI = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/test-azure-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error calling API');
      }

      setResponse(data.message);
      if (data.isMock) {
        setError('API đang sử dụng phản hồi mô phỏng, không kết nối được với Azure OpenAI');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error testing Azure AI:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Kiểm tra kết nối Azure OpenAI
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Nhập tin nhắn để kiểm tra:
          </Typography>
          <TextField
            fullWidth
            label="Tin nhắn"
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={loading || !message.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Gửi tin nhắn'}
          </Button>
        </Paper>

        {(response || loading) && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Phản hồi:
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography>Đang xử lý...</Typography>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {response}
              </Typography>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default TestAzureAI;
