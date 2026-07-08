import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { fa } from "./locales/fa";
import namespace from "./locales/namespace";

const savedLanguage = localStorage.getItem("areya_bazar_lang") || "fa";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      fa,
    },

    lng: savedLanguage,
    fallbackLng: "fa",

    ns: namespace,
    defaultNS: "common",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;