import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import { getAllRoutes } from "../../config/sidenav.config";

// Loading fallback component
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

const MainContainer = () => {
  const allRoutes = getAllRoutes();

  return (
    <div className="mainContent">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {allRoutes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </Suspense>
    </div>
  );
};

export default MainContainer;
