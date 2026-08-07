import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { iwaRoutes } from "../../../config/adminConsole.routes.config";

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

export default function IWAHome() {
  return (
    <Box sx={{ height: "100%", minHeight: 0 }}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route index element={<Navigate to="users" replace />} />
          {iwaRoutes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route path="*" element={<Navigate to="users" replace />} />
        </Routes>
      </Suspense>
    </Box>
  );
}
