import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './index.css';
import Start from './Start';
import Header from './Header'
import Error from './Error'
import UserObject from './UserObject'


window.region = "euw"
if (window.gC("_Cregion")) {
  window.region = window.gC("_Cregion")
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Header />}>
        <Route path="" element={<Start />}></Route>
        <Route path="challenge/:id" element={<Start />}></Route>
        <Route path=":server/:user" element={<UserObject />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>

);
