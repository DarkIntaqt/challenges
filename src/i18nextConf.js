import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './translations/en.json'
// import translationES from './translations/es.json'
// import translationDE from './translations/de.json'
// import translationJA from './translations/ja.json'

const fallbackLng = ['en'];
//const availableLanguages = ['en', 'es', 'de', 'ja'];
const availableLanguages = ['en']


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
         }
         // ,
         // es: {
         //    translation: translationES
         // },
         // de: {
         //    translation: translationDE
         // },
         // ja: {
         //    translation: translationJA
         // }
      }
   })
   ;

export default i18n;