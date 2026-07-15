import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function OutboundDelivery() {
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
        {t("Outbound Delivery")}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Outbound Delivery content will be loaded here.
      </Typography>
    </Box>
  );
}
