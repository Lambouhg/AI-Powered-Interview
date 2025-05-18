import { CircularProgress, Box } from "@mui/material";

export default function LoadingSpinner() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <CircularProgress color="primary" />
      <span style={{ marginLeft: 10 }}>Đang chấm điểm...</span>
    </Box>
  );
}