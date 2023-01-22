import React, { Component } from "react";
import styles from "../css/ad.module.css"
import { checkExists } from "../func/arrayManipulationFunctions.js"

export default class Ad extends Component {
    constructor(props) {
        super(props)
        this.style = {}
        if (checkExists(props.style)) {
            this.style = props.style
        }
        this.id = 0
    }

    componentWillUnmount() {
        try {
            window.clearAd(this.id)
        } catch (e) {
            console.warn("Error clearing ads");
            console.warn(e)
        }
    }

    componentDidMount() {
        try {
            window.renderAd(this.id)
        } catch (e) {
            console.warn("Error serving ads");
            console.warn(e)
        }
    }

    render() {
        window.adIds++;
        this.id = "ad" + window.adIds
        return <div id={this.id} style={this.style} className={styles.ad + " _ad"}></div>
    }
}