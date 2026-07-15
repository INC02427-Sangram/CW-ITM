import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const moduleLabels = {
  dashboard: "Dashboard",
  "back-to-back-trading": "Back-to-Back Trading",
  "purchase-to-stock": "Purchase Trading",
  "sell-from-stock": "Sales Trading",
  outboundDelivery: "Outbound Delivery",
  invoices: "Invoices",
  "admin-console": "Admin Console",
};

const MainContainer = ({ active }) => {
  const { t } = useTranslation();
  const label = moduleLabels[active] ?? active;

  return (
    <div className="mainContent">
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
          {t(label)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Content for {label} will be loaded here.
        </Typography>
      </Box>
    </div>
  );
};

export default MainContainer;
