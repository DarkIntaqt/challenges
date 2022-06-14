import { Outlet, Link } from "react-router-dom";
import React from "react"
import StyleSheet from "./css/header.module.css";

export default function Header() {
    return <React.Fragment>
        <div className={StyleSheet.Header}>
            <div className={StyleSheet.inner}>
                <Link to="/">League Challenges</Link>
                <Link to="/faq">FAQ</Link>
            </div>
        </div>

        <a className={StyleSheet.git} href="https://github.com/DarkIntaqt/challenges" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i> open source</a>

        <div className={StyleSheet.HeaderPlaceholder}>

        </div>
        <div className={StyleSheet.content}>

            <Outlet></Outlet>
        </div>

    </React.Fragment >
}