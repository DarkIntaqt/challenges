import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { useLayoutEffect } from 'react';
import './index.css';
import Start from './Start';
import Header from './Header'
import Error from './Error'
import UserObject from './UserObject'
import FAQ from './FAQ'
import Title from './title'
import css from "./css/user.module.css";

function checkFor(variable) {
  if (typeof variable === "undefined") {
    return false
  }
  return true
}

if (!checkFor(window.challenges)) {
  window.challenges = {}
} else {
  console.info(window.challenges)
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


window.loadingUI = [
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>,
  <a className={css.challenge + " UNRANKED loading"} href="#loading"><p className={css.title}>Loading<span>Loading</span></p><p className={css.description}>Loading</p></a>
];

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
        <Route path="challenge/:id" element={<UserObject />}></Route>
        <Route path=":server/:user" element={<UserObject />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Route>
    </Routes>
  </Wrapper>
</BrowserRouter>)
