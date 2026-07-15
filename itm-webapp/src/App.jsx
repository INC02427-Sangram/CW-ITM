import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import AppHeader from "./components/MainContainer/AppHeader";
import SideNav from "./components/MainContainer/SideNav";
import MainContainer from "./components/MainContainer/MainContainer";

function App() {
  const { t, i18n } = useTranslation();
  console.log("i18n.language: ", i18n);
  const [activeModule, setActiveModule] = useState("dashboard");

  // loading language from local system when application loads for the first time
  useEffect(() => {
    try {
      i18n.changeLanguage(navigator.language.split("-")[0]);
    } catch (error) {
      console.error("Error changing language: ", error);
    }
  }, []);

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <SideNav active={activeModule} onNavigate={setActiveModule} />
        <MainContainer active={activeModule} />
      </div>
    </div>
  );
}

export default App;
