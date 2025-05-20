import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Container, Typography, Box, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const InterviewPractice = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    } else {
      setLoading(false);
    }
  }, [user, router]);
  const handleStartPractice = () => {
    router.push('/interview-practice/test');
  };

  const handleStartLiveInterview = () => {
    router.push('/interview-practice/live-interview');
  };
  
  const handleTestAI = () => {
    router.push('/interview-practice/test-ai');
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Interview Practice
        </Typography>
        
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            Welcome to Interview Practice
          </Typography>
          <Typography paragraph>
            Practice your interview skills with our AI-powered interview simulator. 
            Get instant feedback and improve your responses.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStartPractice}
              sx={{ mt: 2 }}
            >
              Start Practice Session
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleStartLiveInterview}
              sx={{ mt: 2 }}
            >
              Phỏng vấn trực tiếp với AI
            </Button>
            <Button
              variant="outlined"
              color="info"
              size="large"
              onClick={handleTestAI}
              sx={{ mt: 2 }}
            >
              Test Azure AI
            </Button>
          </Box>
        </StyledPaper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom>
                Features
              </Typography>
              <ul>
                <li>Real-time AI feedback</li>
                <li>Customizable interview scenarios</li>
                <li>Performance tracking</li>
                <li>Detailed response analysis</li>
                <li>Live interview simulation</li>
              </ul>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom>
                Tips for Success
              </Typography>
              <ul>
                <li>Be clear and concise in your responses</li>
                <li>Use specific examples from your experience</li>
                <li>Maintain professional communication</li>
                <li>Review feedback to improve</li>
              </ul>
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default InterviewPractice;
