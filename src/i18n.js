import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {en} from "./locales/en"
import {fa} from "./locales/fa"
import namespace from "./locales/namespace";


i18n
    .use(initReactI18next)
    .init({
        resources: {
            en,
            fa
        },

        lng: "fa",
        fallbackLng: "en",

        ns: namespace,
        defaultNS: "common",

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;