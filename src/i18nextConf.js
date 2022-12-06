import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './translations/en.json'
import translationES from './translations/es.json'
import translationDE from './translations/de.json'

const fallbackLng = ['en'];
const availableLanguages = ['en', 'es', 'de'];



i18n
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
      },
      resources: {
         en: {
            translation: translation
         },
         es: {
            translation: translationES
         },
         de: {
            translation: translationDE
         }
      }
   })
   ;

export default i18n;