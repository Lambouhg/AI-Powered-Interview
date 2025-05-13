import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Typography, Box, Paper, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const CVBuilder = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    jobTitle: '',
    education: '',
    experience: '',
    skills: '',
    languages: '',
    projects: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerateCV = async () => {
    localStorage.setItem('cvFormData', JSON.stringify(form));
    router.push('/cv-builder/result');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI CV Builder
        </Typography>

        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Enter your details to generate a professional CV
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(form).map(([key, value]) => (
              <Grid item xs={12} sm={key === 'education' || key === 'experience' || key === 'projects' ? 12 : 6} key={key}>
                <TextField
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  fullWidth
                  multiline={key === 'education' || key === 'experience' || key === 'projects'}
                  rows={key === 'education' || key === 'experience' || key === 'projects' ? 3 : 1}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="contained" size="large" onClick={handleGenerateCV}>
              Generate CV
            </Button>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default CVBuilder;
