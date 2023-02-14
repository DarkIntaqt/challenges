import i18next from "i18next";
import { Component } from "react";
import { setCookie } from "../func/cookiefunctions";

function getFlagEmoji(countryCode) {
   const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
   return String.fromCodePoint(...codePoints);
}

const languages = [
   ["en", "English"],
   ["de", "Deutsch"],
   ["fr", "Français"],
   ["es", "Español"],
   ["ja", "日本語"],
   ["pt", "Português (Brasil)"]
]

export default class Settings extends Component {

   constructor() {
      super();

      this.changeLanguage = this.changeLanguage.bind(this);
      this.state = {
         lang: window.language
      }
   }

   changeLanguage(e) {
      let lang = e.currentTarget.getAttribute("data-lang");

      window.language = lang;
      setCookie("lang", lang);
      i18next.changeLanguage(lang);
      this.setState({
         language: lang
      })
   }

   render() {

      const changeLanguages = languages.map((lang) => {
         let style = {
            cursor: "pointer"
         };

         if (lang[0] === window.language) {
            style.borderColor = "white";
         }

         return <div data-lang={lang[0]} style={style} key={lang[0]} onClick={this.changeLanguage}>
            {lang[1]}
         </div>
      })

      return <div className={"object1000 faq"}>
         <h1>Settings</h1>
         <h2>Select your language</h2>
         {changeLanguages}
      </div>;
   }
}