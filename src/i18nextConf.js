import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

const fallbackLng = ['en'];
const availableLanguages = ['en', 'ar', 'fr'];



i18n
   .use(Backend) // load translations using http (default                                               public/assets/locals/en/translations)
   .use(initReactI18next) // pass the i18n instance to react-i18next.
   .init({
      fallbackLng, // fallback language is english.

      detection: {
         checkWhitelist: true, // options for language detection
      },

      debug: true,

      whitelist: availableLanguages,

      interpolation: {
         escapeValue: false, // no need for react. it escapes by default
      },
   });

export default i18n;