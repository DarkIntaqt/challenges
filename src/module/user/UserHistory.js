import { Component } from "react";
import Loader from "../Loader";
import get from "../../func/get";
import { getCache } from "../../func/getCheckCache";
import Match from "./Match";


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
        this.addQueues = this.addQueues.bind(this)

        this.state = {
            verified: verified,
            matches: [],
            challenges: {},
            queues: [],
            error: false
        }
    }

    rewrap(challenges) {
        try {
            let response = {}
            for (let i = 0; i < challenges.length; i++) {
                response[challenges[i][0]] = challenges[i]
            }
            return response
        } catch (e) {
            this.setState({ error: "Error: Most likely no matches played since feature activation" })
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
        if (content.response.length === 0 || content.start.length === 0) {
            this.setState({ error: "No Matches" })
            return
        }
        this.setState({ matches: content.response, challenges: this.rewrap(content.start) })
    }

    addQueues(queues) {
        this.setState({ queues: queues })
    }

    loadHistory() {
        if (this.state.error !== false) { return }
        const user = JSON.parse(JSON.stringify(this.props.summoner));

        if (user.challenges.length === 0) { return }
        if (this.state.verified === 0) {
            get("https://challenges.darkintaqt.com/api/v1/c-vip/?id=" + user.id, this.validateVerified);
            return
        }
        if (this.state.verified !== true) { return }

        if (this.state.queues.length === 0) {
            get("https://cdn.darkintaqt.com/lol/static/gamedata/queues.json", this.addQueues);
            return
        } else {
            window.queues = this.state.queues
        }

        if (this.state.matches.length === 0) {
            get("https://challenges.darkintaqt.com/api/v1/history/?id=" + user.id, this.addHistory)
        }
    }


    render() {

        if (this.state.error !== false) {
            return <div style={{ width: "100%", float: "left" }}>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center", margin: "100px 0" }}>{this.state.error}</p>
            </div>
        }

        const user = JSON.parse(JSON.stringify(this.props.summoner));

        if (user.challenges.length === 0) {
            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>20%</p>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Summoner...</p>
            </div>
        }
        document.title = `${user.summonerName}'s Challenge History`

        if (this.state.verified === 0) {
            return <div style={{ width: "100%", float: "left" }}>
                <Loader /><p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>40%</p>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Checking feature availability...</p>
            </div>
        }


        if (this.state.verified !== true) {
            window.location.href = `/${user.server}/${user.summonerName}`
            return <div style={{ width: "100%", float: "left" }}>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>This feature is not enabled for this summoner</p>
            </div>
        }

        if (this.state.queues.length === 0) {
            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>60%</p>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading assets...</p>
            </div>
        }

        if (this.state.matches.length === 0) {
            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>80%</p>
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading match history...</p>
            </div>
        }

        let challenges = this.state.challenges

        const allMatches = this.state.matches

        let matches = allMatches.slice(0, 10).map(function (match) {
            let newChanges = []

            for (let i = 0; i < match.changes.length; i++) {
                const changes = match.changes[i];
                newChanges.push({
                    challengeId: changes[0],
                    from: {
                        tier: changes[1],
                        points: changes[2]
                    },
                    to: {
                        tier: challenges[changes[0]][1],
                        points: challenges[changes[0]][2]
                    }
                })
                challenges[changes[0]] = changes
            }
            return <Match matchid={match.matchId} changes={newChanges} id={user.id} key={match.matchId} />
        })

        return matches

    }
}