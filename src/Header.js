import { Outlet, Link } from "react-router-dom";
import React from "react"
import StyleSheet from "./css/header.module.css";

export default function Header() {
    return <React.Fragment>
        <div className={StyleSheet.Header}>
            <div className={StyleSheet.inner}>
                <Link to="/">League Challenges</Link>
            </div>
        </div>
        <div className={StyleSheet.HeaderPlaceholder}>

        </div>
        <div className={StyleSheet.content}>
            <Outlet></Outlet>
        </div>

    </React.Fragment>
}