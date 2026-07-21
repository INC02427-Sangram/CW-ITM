import { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CircularProgress, Box } from "@mui/material";
import "./App.css";
import "./theme-light.css"
import AppHeader from "./components/MainContainer/AppHeader";
import SideNav from "./components/MainContainer/SideNav";
import MainContainer from "./components/MainContainer/MainContainer";
import { routesConfig } from "./config/routes.config";

// Layout wrapper component
function Layout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <SideNav />
        <MainContainer />
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
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
}

function App() {
  const { i18n } = useTranslation();

  // loading language from local system when application loads for the first time
  useEffect(() => {
    try {
      const browserLang = navigator.language.split("-")[0];
      i18n.changeLanguage(browserLang);
    } catch (error) {
      console.error("Error changing language: ", error);
    }
  }, [i18n]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            {routesConfig.map((route) =>
              route.isIndex ? (
                <Route key={route.id} index element={<route.component />} />
              ) : (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.component />}
                />
              ),
            )}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
