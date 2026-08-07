import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function UserSummary() {
  const { t } = useTranslation();

  return (
    <Box className="outermost-container">
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {t("Users")}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        User management content will be loaded here.
      </Typography>
    </Box>
  );
}
