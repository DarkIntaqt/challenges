import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
// import translation from './translations/en.json'
// import translationES from './translations/es.json'
// import translationDE from './translations/de.json'
// import translationJA from './translations/ja.json'

const fallbackLng = ['en'];
const availableLanguages = ['en', 'es', 'de', 'ja', 'fr', 'pt'];


i18n
   .use(Backend)
   .use(initReactI18next)
   .init({
      backend: {
         // for all available options read the backend's repository readme file
         loadPath: '/translations/{{lng}}.json'
      },
      fallbackLng,

      detection: {
         checkWhitelist: true,
      },

      whitelist: availableLanguages,

      interpolation: {
         escapeValue: false,
      },
      react: {
         useSuspense: false
      },

   });

export default i18n;