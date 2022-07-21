import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { useLayoutEffect } from 'react';
import './index.css';
import Start from './module/Start';
import Header from './module/Header'
import Error from './module/Error'
import UserObject from './module/UserObject'
import FAQ from './module/FAQ'
import Title from './module/Title'
import css from "./css/user.module.css";
import Challenges from "./module/Challenges"
import get from "./func/get";

function checkFor(variable) {
  if (typeof variable === "undefined") {
    return false
  }
  return true
}

if (!checkFor(window.challenges)) {
  window.challenges = {}
}

if (!checkFor(window.region)) {
  window.region = "na"
}

if (window.gC("_Cregion")) {
  window.region = window.gC("_Cregion")
} else {
  // Set region cookie if it is not already set
  let date = new Date();
  date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
  const expires = date.toUTCString();

  document.cookie = "_Cregion=" + window.region + ";expires=" + expires + ";path=/;Secure"
}

window.loadingUI = [];
for (let i = 0; i < 16; i++) { window.loadingUI.push(<a key={i} className={css.challenge + " UNRANKED " + css.loading} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>) }

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children
}

const root = createRoot(document.getElementById('root'));
root.render(<BrowserRouter>
  <Wrapper>
    <Routes>
      <Route path="/" element={<Header />}>
        <Route path="" element={<Start />}></Route>
        <Route path="faq" element={<FAQ></FAQ>}></Route>
        <Route path="titles" element={<Title />}></Route>
        <Route path="challenges" element={<Challenges />}></Route>
        <Route path="challenge/:id" element={<UserObject />}></Route>
        <Route path=":server/:user" element={<UserObject />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Route>
    </Routes>
  </Wrapper>
</BrowserRouter>)


// Reload window when changes are detected
let lastCheckedTimestamp = new Date().getTime()

setInterval(() => {
  let now = new Date().getTime()
  if ((now - lastCheckedTimestamp) > 60000) {
    lastCheckedTimestamp = now
    get("https://challenges.darkintaqt.com/api/v2/v/?t=" + now, function (e) {
      if (e[0] !== window.versionHash) {
        document.location.reload()
      }
    }, function () { document.location.reload() });
  }
}, 3600000);
