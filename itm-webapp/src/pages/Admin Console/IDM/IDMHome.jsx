import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function IDMHome() {
  const { t } = useTranslation();

  return (
    <Box className="outermost-container">
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {t("Rules & Decision Management")}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Decision Management content will be loaded here.
      </Typography>
    </Box>
  );
}
