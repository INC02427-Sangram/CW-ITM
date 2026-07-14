import "./App.css";
import "./theme-light.css";
import AppHeader from "./components/AppHeader/AppHeader";
import SideNav from "./components/SideNav/SideNav";
import MainContainer from "./components/MainContainer/MainContainer";
import SessionTimeoutWarningModal from "./utility/SessionTimeoutWarningModal";
import CherryBot from "./components/CherryBot/CherryBot";
import { useSelector } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";

import useAuth from "./hooks/useAuth";
import useAppTheme from "./hooks/useAppTheme";
import useSessionTimeout from "./hooks/useSessionTimeout";
import useAppInitialization from "./hooks/useAppInitialization";

function App() {
  const { isAuthorized } = useAuth();
  const { theme, isDark } = useAppTheme();
  const { isIdleWarningVisible, handleLogout, handleContinueSession } = useSessionTimeout();
  
  useAppInitialization();

  // Authorization guards
  if (isAuthorized === null) {
    return null; // Loading state - show nothing while checking authorization
  }

  if (isAuthorized === false) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <h1>You are unauthorized to access IOM application.</h1>
      </div>
    );
  }

  // Render main application
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppHeader />
        <div className="appContent">
          <SideNav />
          <div className="mainContent">
            <MainContainer />
          </div>
        </div>

        {/* CherryBot Commented */}
        {/* <CherryBot /> */}
      </div>

      <SessionTimeoutWarningModal
        show={isIdleWarningVisible}
        onLogout={handleLogout}
        onContinue={handleContinueSession}
      />
    </ThemeProvider>
  );
}

export default App;
