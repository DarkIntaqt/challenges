import css from "../../css/stats.module.css"
import { Component } from "react";
import Loader from "../Loader";
import get from "../../func/get";
import Match from "./Match";
import { getStorage, setStorage, storageKeys } from "../../func/localStorageFunctions";
import { Tooltip } from "react-tooltip";


export default class History extends Component {
    constructor(props) {
        super(props)

        this.props = props

        this.loadHistory = this.loadHistory.bind(this)
        this.loadChallenges = this.loadChallenges.bind(this)
        this.addHistory = this.addHistory.bind(this)
        this.addQueues = this.addQueues.bind(this)

        this.state = {
            verified: props.verified,
            matches: [],
            challenges: {},
            queues: [],
            error: false,
            challengesJSON: [],
            show: 100,
            showMaxChallenges: getStorage(storageKeys.showMaxChallenges, true),
            showRecap: getStorage(storageKeys.showRecap, true),

        }
    }

    loadChallenges(challenges) {
        window.JSONPRequest = challenges
        this.setState({ challengesJSON: challenges })
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


    componentDidMount() {

        if (getStorage(storageKeys.showMaxChallenges, window.location.href) === window.location.href) {
            setStorage(storageKeys.showMaxChallenges, true);
        }

        this.loadHistory()

    }

    componentDidUpdate() {

        if (this.props.verified !== this.state.verified) {
            this.setState({ verified: true });
        }

        this.loadHistory();
    }

    addHistory(content) {
        if (content.response.length === 0 || content.start.length === 0) {
            this.setState({ error: "No Matches played since this feature got enabled" })
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
        if (this.state.verified !== true) { return }

        if (this.state.queues.length === 0) {
            get("https://cdn.darkintaqt.com/lol/static/gamedata/queues.json", this.addQueues);
            return
        } else {
            window.queues = this.state.queues
        }

        if (this.state.challengesJSON.length === 0) {
            get(`https://challenges.darkintaqt.com/api/dynamic-data/serve?region=euw1&lang=${window.language}`, this.loadChallenges);
            return
        }

        if (this.state.matches.length === 0) {
            get("https://challenges.darkintaqt.com/api/v1/history/?id=" + user.id, this.addHistory, () => { this.setState({ error: "Failed to load match history." }) })
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
            return <div style={{ width: "100%", float: "left", display: "flex", justifyContent: "center" }}>
                <div className={css.rowParent}>
                    <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>
                        This feature is not enabled for this summoner.
                        <br />
                        <br />
                        Get challenge progress per match by enabling this feature
                        <br />
                        <i style={{ padding: "10px", display: "block", fontSize: "0.8rem", color: "var(--light2)" }}>Please keep in mind that this feature is in public beta. <br />Feel free to report all issues on Github. </i>
                    </p>
                    <p className={css.advertisement}>
                        <a href="/verify" target="_blank" style={{ color: "white" }}>Verify now</a>
                    </p>
                </div>
            </div>;
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

        const allMatches = JSON.parse(JSON.stringify(this.state.matches))

        let matches = allMatches.map((match) => {
            let newChanges = []

            for (let i = 0; i < match.changes.length; i++) {
                const changes = match.changes[i];
                let old = {
                    tier: -1,
                    points: 0
                }
                try {
                    old = {
                        tier: challenges[changes[0]][1],
                        points: challenges[changes[0]][2]
                    }
                } catch (e) {
                    console.warn(`${changes[0]} does not exist`)
                } finally {

                    newChanges.push({
                        challengeId: changes[0],
                        new: {
                            tier: changes[1],
                            points: changes[2]
                        },
                        old: old
                    })

                    challenges[changes[0]] = changes
                }

            }
            return <Match matchid={match.matchId} changes={newChanges} id={user.id} region={user.server} key={match.matchId} showMaxedChallenges={this.state.showMaxChallenges} />
        })

        const renderMatches = matches.reverse().slice(0, this.state.show);

        return <div className={css.matches}>
            <Tooltip id="hide-tip" />
            <div className={css.heading}>
                <button className={!this.state.showMaxChallenges ? css.active : css.inactive} onClick={() => {
                    setStorage(storageKeys.showMaxChallenges, !this.state.showMaxChallenges);
                    this.setState({ showMaxChallenges: !this.state.showMaxChallenges });
                }} data-tooltip-id="hide-tip" data-tooltip-content={"Don't show challenges that are either maxed or Master+"}>
                    <img src="https://lolcdn.darkintaqt.com/cdn/i.png" alt="" />
                    Hide maxed challenges
                </button>

                <button className={!this.state.showRecap ? css.active : css.inactive} onClick={() => {
                    setStorage(storageKeys.showRecap, !this.state.showRecap);
                    this.setState({ showRecap: !this.state.showRecap });
                }}>
                    <img src="https://cdn.darkintaqt.com/lol/static/challenges/clock.svg" alt="" />
                    Progress summary
                </button>
            </div>
            <div className={css.matches}>
                {renderMatches}
            </div>
            {
                matches.length <= this.state.show ? null :
                    <button className={css.loadMore} onClick={() => { this.setState({ show: this.state.show + 100 }) }}>Load more</button>
            }
        </div >;

    }
}