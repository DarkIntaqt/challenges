import { Component } from "react";
import Loader from "../Loader";
import get from "../../func/get";
import { getCache } from "../../func/getCheckCache";

export default class History extends Component {
    constructor(props) {
        super(props)

        this.props = props

        let verified = 0
        if (this.props.summoner.challenges.length !== 0) {
            const verifiedCache = getCache("https://challenges.darkintaqt.com/api/v1/c-vip/?id=" + this.props.summoner.id)

            if (verifiedCache !== false) {
                verified = verifiedCache[0]
            }
        }

        this.validateVerified = this.validateVerified.bind(this)
        this.loadHistory = this.loadHistory.bind(this)
        this.addHistory = this.addHistory.bind(this)

        this.state = {
            verified: verified,
            matches: []
        }
    }

    validateVerified(e) {
        if (e[0] === true) {
            this.setState({ verified: true })
            return
        }
        this.setState({ verified: false })
    }


    componentDidMount() {
        this.loadHistory()
    }

    componentDidUpdate() {
        this.loadHistory()
    }

    addHistory(content) {
        this.setState({ matches: content.response })
    }

    loadHistory() {
        const user = JSON.parse(JSON.stringify(this.props.summoner));

        if (user.challenges.length === 0) { return }
        if (this.state.verified === 0 || this.state.verified !== true) { return }


        get("https://challenges.darkintaqt.com/api/v1/history/?id=" + user.id, this.addHistory)
    }


    render() {
        const user = JSON.parse(JSON.stringify(this.props.summoner));

        if (user.challenges.length === 0) {
            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>25%</p>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Summoner...</p>
            </div>
        }

        if (this.state.verified === 0) {
            get("https://challenges.darkintaqt.com/api/v1/c-vip/?id=" + user.id, this.validateVerified)
            return <div style={{ width: "100%", float: "left" }}>
                <Loader /><p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>50%</p>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Checking feature availability...</p>
            </div>
        }


        if (this.state.verified !== true) {
            window.location.href = `/${user.server}/${user.summonerName}`
            return <div style={{ width: "100%", float: "left" }}>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>This feature is not enabled for this summoner</p>
            </div>
        }

        if (this.state.matches.length === 0) {
            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>75%</p>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading match history</p>
            </div>
        }

    }
}