import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./App.css";
import "./theme-light.css";
import AppHeader from "./components/MainContainer/AppHeader";
import SideNav from "./components/MainContainer/SideNav";
import MainContainer from "./components/MainContainer/MainContainer";

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
      <div className="App">
        <AppHeader />
        <div className="appContent">
          <SideNav />
          <MainContainer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
