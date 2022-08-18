import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { useLayoutEffect, Fragment } from 'react';
import './index.css';
import Start from './module/Start';
import HeaderNFooter from './module/Header-n-Footer'
import Error from './module/Error'
import UserObject from './module/UserObject'
import FAQ from './module/FAQ'
import Title from './module/Title'
import Challenges from "./module/Challenges"
import get from "./func/get";
import config from './config';
import VariableProxy from './module/VariableProxy';

function checkFor(variable) {
  if (typeof variable === "undefined") {
    return false
  }
  return true
}


function main() {

  const windowVariables = config.windowVariables
  Object.keys(windowVariables).forEach(function (key, index) {
    if (!checkFor(window[key])) {
      console.info(`'${key}' does not exist, set to default value. `)
      window[key] = windowVariables[key]
    }
  });

  if (window.gC("_Cregion")) {
    window.region = window.gC("_Cregion")
  } else {
    // Set region cookie if it is not already set
    let date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = date.toUTCString();

    document.cookie = "_Cregion=" + window.region + ";expires=" + expires + ";path=/;Secure"
  }

  const ScrollToTop = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children
  }


  const root = createRoot(document.getElementById('root'));
  root.render(<BrowserRouter>
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<Fragment><HeaderNFooter /><VariableProxy /></Fragment>}>
          <Route path="" element={<Start />}></Route>
          <Route path="faq" element={<FAQ></FAQ>}></Route>
          <Route path="titles" element={<Title />}></Route>
          <Route path="challenges" element={<Challenges />}></Route>
          <Route path="challenge/:id" element={<UserObject />}></Route>
          <Route path=":server/:user" element={<UserObject />}></Route>
          <Route path="*" element={<Error />}></Route>
        </Route>
      </Routes>
    </ScrollToTop>
  </BrowserRouter>)


  // Reload window when changes are detected
  let lastCheckedTimestamp = new Date().getTime()

  setInterval(() => {
    let now = new Date().getTime()
    if ((now - lastCheckedTimestamp) > 60000) {
      lastCheckedTimestamp = now
      get("https://challenges.darkintaqt.com/api/v2/v/?t=" + now, function (e) {
        if (e[0] !== window.versionHash) {
          window.reloadLocation = true
        }
      }, function () { document.location.reload() });
    }
  }, config.config.reloadAfter);

}

main();
