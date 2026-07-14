import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Default translations (can be empty or minimal)
import translationEN from "./locales/en/translation.json";

// Initial resources with just English
const resources = {
  en: {
    translation: translationEN,
  }
};

// i18N Initialization
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

// Function to update translations dynamically
export const updateTranslations = (translations, availableLanguages) => {
  if (!translations || Object.keys(translations).length === 0) return;

  // For each language, create a translation object
  availableLanguages.forEach(lang => {
    const langResources = {};
    
    // Convert API response format to i18next format
    Object.keys(translations).forEach(key => {
      const langKey = `${lang.language}_${lang.text}`;
      if (translations[key][langKey]) {
        langResources[key] = translations[key][langKey];
      }
    });
    
    // For English, local translation.json is the source of truth —
    // don't let backend overwrite keys that are already defined locally.
    // For other languages, allow backend to supply all translations freely.
    if (lang.value === "en") {
      const existingBundle = i18n.getResourceBundle("en", "translation") || {};
      const filteredResources = {};
      Object.keys(langResources).forEach((key) => {
        if (!existingBundle[key]) {
          filteredResources[key] = langResources[key];
        }
      });
      i18n.addResourceBundle("en", "translation", filteredResources, true, false);
    } else {
      i18n.addResourceBundle(lang.value, "translation", langResources, true, true);
    }
  });
};

export default i18n;
