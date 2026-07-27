import { Box, Typography, Card, CardContent, Grid, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const { t } = useTranslation();
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);

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
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome to the Dashboard, {isAuthenticated ? `${userInfo.firstName}!` : "Guest!"}
      </Typography>

   
    </Box>
  );
}
