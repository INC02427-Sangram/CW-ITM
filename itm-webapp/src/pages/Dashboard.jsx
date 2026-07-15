import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        height: "100%",
        borderRadius: "10px 0px 0px 0px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "16px",
      }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {t("Dashboard")}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to the Dashboard. Your overview will be displayed here.
      </Typography>
    </Box>
  );
}
