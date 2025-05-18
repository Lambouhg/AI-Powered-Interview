import { Button, Box } from "@mui/material";
import { useRouter } from "next/router";

export default function ActionButtons({ cvUrl }) {
  const router = useRouter();

  return (
    <Box mt={4} display="flex" justifyContent="space-between">
      <Button variant="contained" color="primary" onClick={() => router.push("/")}>
        Quay lại
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => window.open(cvUrl, "_blank")}>
        Xem CV
      </Button>
    </Box>
  );
}
