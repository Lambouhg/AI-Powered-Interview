import { styled } from '@mui/material/styles';
import { Paper, List, ListItem } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  height: '60vh',
  display: 'flex',
  flexDirection: 'column',
}));

export const MessageList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
}));

export const MessageItem = styled(ListItem)(({ theme, sender }) => ({
  flexDirection: 'column',
  alignItems: sender === 'user' ? 'flex-end' : 'flex-start',
  padding: theme.spacing(1),
}));

export const MessageContent = styled(Paper)(({ theme, sender }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: sender === 'user' ? theme.palette.primary.light : theme.palette.grey[100],
  color: sender === 'user' ? theme.palette.primary.contrastText : 'inherit',
  borderRadius: theme.spacing(2),
  maxWidth: '80%',
}));
