import "./i18nextConf";
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
import PathProxy from './module/PathProxy'
import FAQ from './module/FAQ'
import Title from './module/Title'
import Challenges from "./module/Challenges"
import get from "./func/get";
import { checkExists as checkFor } from './func/arrayManipulationFunctions.js';
import config from './config';
import VariableProxy from './module/VariableProxy';

import Loader from './module/Loader';
import Loadable from 'react-loadable';
import { getCookie, setCookie } from "./func/cookiefunctions"
import i18next from "i18next";
import Settings from "./module/Settings";
import ErrorBoundary from "./module/ErrorBoundary";

function main() {

  const root = createRoot(document.getElementById('root'));

  const windowVariables = config.windowVariables
  Object.keys(windowVariables).forEach(function (key, index) {
    if (!checkFor(window[key])) {
      console.info(`'${key}' does not exist, set to default value. `)
      window[key] = windowVariables[key]
    }
  });



  if (getCookie) {

    if (getCookie("_Cfilter")) {
      window.compactMode = (getCookie("_Cfilter") === 'true')
    } else {
      setCookie("filter", window.compactMode.toString())
    }
    if (getCookie("_Cregion")) {
      window.region = getCookie("_Cregion")
    } else {
      setCookie("region", window.region);
    }

    if (getCookie("_Clang")) {
      window.language = getCookie("_Clang")
    } else {
      setCookie("lang", window.language);
    }

    i18next.changeLanguage(window.language);

  }

  const ScrollToTop = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children
  }

  const Community = Loadable({
    loader: (content) => import('./module/Community'),
    loading: function () {
      return <div style={{ width: "100%", float: "left" }}>
        <Loader />
        <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading...</p>
      </div>
    },
  });

  root.render(<BrowserRouter>

    <ErrorBoundary>

      {/* SCROLL TO TOP ON ROUTE CHANGE */}
      <ScrollToTop>

        <Routes>

          <Route path="/" element={<Fragment>
            <HeaderNFooter />
            <VariableProxy />
          </Fragment>}>

            <Route path="" element={<Start />}></Route>

            <Route path="faq" element={<FAQ />}></Route>

            <Route path="settings" element={<Settings />}></Route>

            <Route path="community" element={<Community />}></Route>

            <Route path="titles" element={<Title />}></Route>

            <Route path="challenges" element={<Challenges />}></Route>

            <Route path="challenge/:id" element={<PathProxy />}></Route>

            <Route path=":server/:user/*" element={<PathProxy />}></Route>

            <Route path="*" element={<Error />}></Route>

          </Route>

        </Routes>

      </ScrollToTop>

    </ErrorBoundary>

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

// launch app
main();
