import { useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "./App.css";
import "./theme-light.css";
import AppHeader from "./components/MainContainer/AppHeader";
import SideNav from "./components/MainContainer/SideNav";
import MainContainer from "./components/MainContainer/MainContainer";

function App() {
  const { i18n } = useTranslation();
  const language = useSelector((state) => state.user.preferences.language);

  // Keep i18n in sync with the language saved in Application Settings
  useEffect(() => {
    if (!language || i18n.language === language) return;

    i18n.changeLanguage(language).catch((error) => {
      console.error("Error changing language: ", error);
    });
  }, [i18n, language]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("/api/test1");
      console.log(data);
    };
    fetchData();
  }, []);

  return (
    <HashRouter>
      <div className="App">
        <AppHeader />
        <div className="appContent">
          <SideNav />
          <MainContainer />
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
