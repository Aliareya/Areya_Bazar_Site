import { create } from "zustand";
import i18n from "../i18n";

const useLangStore = create((set) => ({
  language: i18n.language,

  changeLanguage: async (lang) => {
    await i18n.changeLanguage(lang);

    localStorage.setItem("areya_bazar_lang", lang);

    set({ language: lang });
  },
}));

export default useLangStore;