import React, { Component } from "react";
import styles from "../css/ad.module.css"
import { checkExists } from "../func/arrayManipulationFunctions.ts"

export default class Ad extends Component {
    constructor(props) {
        super(props)
        this.unit = []
        this.style = {}
        if (checkExists(props.style)) {
            this.style = props.style
        }
        this.id = 0
    }

    componentWillUnmount() {
        try {
            window.clearAd([this.unit])
        } catch (e) {
            console.warn("ad functions are not loaded (yet)");
        }
    }

    componentDidMount() {
        try {
            this.unit = window.renderAd(this.id)
        } catch (e) {
            console.warn("ad functions are not loaded (yet)");
        }
    }

    render() {
        console.log("render");
        window.adIds++;
        this.id = "ad" + window.adIds
        return <div id={this.id} style={this.style} className={styles.ad + " _ad"}></div>
    }
}