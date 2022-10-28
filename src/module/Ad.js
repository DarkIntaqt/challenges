import React, { Component } from "react";
import styles from "../css/ad.module.css"

export default class Ad extends Component {
    constructor() {
        super()
        this.unit = []
        this.id = 0
    }

    componentWillUnmount() {
        try {
            window.clearAd([this.unit])
        } catch (e) {
            console.warn("ad functions are not loaded");
        }
    }

    componentDidMount() {
        try {
            this.unit = window.renderAd(this.id)
        } catch (e) {
            console.warn("ad functions are not loaded");
        }
    }

    render() {
        window.adIds++;
        this.id = "ad" + window.adIds
        return <div id={this.id} className={styles.ad}></div>
    }
}