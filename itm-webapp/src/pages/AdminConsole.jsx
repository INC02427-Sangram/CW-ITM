import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { adminConsoleRoutes } from "../config/adminConsole.routes.config";

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      minHeight: "400px",
    }}
  >
    <CircularProgress />
  </Box>
);

function AdminConsoleLanding() {
  const { t } = useTranslation();

  return (
    <Box className="outermost-container">
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {t("Admin Console")}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Select IDM or IWA from the sub navigation to continue.
      </Typography>
    </Box>
  );
}

export default function AdminConsole() {
  return (
    <Box sx={{ height: "100%", minHeight: 0 }}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route index element={<AdminConsoleLanding />} />
          {adminConsoleRoutes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </Suspense>
    </Box>
  );
}
