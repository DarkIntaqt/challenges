import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import translation from './translation.json'

const fallbackLng = ['en'];
const availableLanguages = ['en', 'es'];



i18n
   .use(Backend)
   .use(initReactI18next)
   .init({
      fallbackLng,

      detection: {
         checkWhitelist: true,
      },

      debug: true,

      whitelist: availableLanguages,

      interpolation: {
         escapeValue: false,
      },
      react: {
         useSuspense: false
      }
   })
   ;

export default i18n;