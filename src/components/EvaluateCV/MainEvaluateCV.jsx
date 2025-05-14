import { Box, Typography } from "@mui/material";
import LoadingSpinner from "../../components/EvaluateCV/LoadingSpinner";
import ResultCard from "../../components/EvaluateCV/ResultCard";
import ActionButtons from "../../components/EvaluateCV/ActionButtons";

export default function MainEvaluateCV({ loading, result, cvUrl }) {
  return (
    <Box maxWidth="900px" mx="auto" py={6} px={4}>
      <Typography variant="h4" align="center" gutterBottom>
        Đánh giá CV bằng AI 
      </Typography>

      {loading ? (
        <LoadingSpinner />
      ) : (
        result && (
          <Box>
            <ResultCard result={result} />
            <ActionButtons cvUrl={cvUrl} />
          </Box>
        )
      )}
    </Box>
  );
}
