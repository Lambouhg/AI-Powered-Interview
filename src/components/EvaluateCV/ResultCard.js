import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function ResultCard({ result }) {
  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Điểm tổng quan: {result.score}/10
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Nhận xét:</strong> {result.feedback}
      </Typography>

      {/* Suggestions */}
      <div>
        <Typography variant="body1" gutterBottom>
          <strong>Gợi ý cải thiện:</strong>
        </Typography>
        <List>
          {result.suggestions.map((s, index) => (
            <ListItem key={index}>
              <ListItemText primary={s} />
            </ListItem>
          ))}
        </List>
      </div>

      {/* Highlights */}
      <div>
        <Typography variant="body1" gutterBottom>
          <strong>Điểm mạnh:</strong>
        </Typography>
        <List>
          {result.highlights.map((s, index) => (
            <ListItem key={index}>
              <ListItemText primary={s} />
            </ListItem>
          ))}
        </List>
      </div>
    </Paper>
  );
}