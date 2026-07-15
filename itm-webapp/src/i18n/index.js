import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationHI from "./locales/hi/translation.json";

// initReactI18next connects i18n to react app
i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "en",
  resources: {
    en: {
      translation: translationEN,
    },
    hi: {
      translation: translationHI,
    },
  },
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
