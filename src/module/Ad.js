import { Component } from "react";
import css from "../css/ad.module.css"

export default class Ad extends Component {
    constructor(props) {
        super(props)

        this.id = "_d" + (props.id * Date.now());
        this.style = {};
        this.shown = false;

        if (typeof props.style !== "undefined") {
            this.style = props.style
        }

        this.state = { active: false }
        this.renderAd = this.renderAd.bind(this);
    }

    componentWillUnmount() {
        document.removeEventListener("adsReady", this.renderAd)
        try {
            if (this.shown === true) {
                window.clearAd(this.id)
            }
        } catch (e) {
            //console.warn("Error clearing ads");
            console.warn(e)
        }
    }

    componentDidUpdate() {
        if (this.shown === false && this.state.active === true) {
            try {
                window.renderAd(this.id)
                this.shown = true;
            } catch (e) {
                //console.warn("Error serving ads");
                console.warn(e)
            }
        }
    }

    renderAd() {

        this.setState({ active: true });

    }

    componentDidMount() {

        if (typeof window._cc_m_ad !== "undefined" && window._cc_m_ad === true) {
            this.renderAd();
        } else {
            document.addEventListener("adsReady", this.renderAd);
        }

    }

    render() {
        return (<>
            {this.state.active ? <div className={css.container} data-nosnippet >
                <div className={css.text}>Ad {this.props.id}</div>
                <div id={this.id} style={this.style} className={css.ad + " _ad"} />
            </div> : ""}
        </>)
    }
}