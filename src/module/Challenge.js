import { Component, Fragment } from "react";
import Error from "./Error"
import get from "../func/get"
import css from "../css/user.module.css"
import { serverToHumanReadable, serverToMachineReadable } from "../func/server"
import Timestamp from "react-timestamps"
import { beautifyNum } from "../func/beautify.ts"
import { intToTier } from "../func/tierFunctions";
import { LazyLoadImage } from "react-lazy-load-image-component";
import goTo from "../func/goTo.js";
import start from "../css/start.module.css"
// import showChallengePath from "../func/showChallengePath.js"
// import ShowChildChallenges from "../func/getChildChallenges";
import { checkExists } from "../func/arrayManipulationFunctions.ts";
import config from "../config";

//import excss from "../css/aboutChallenge.module.css"

export default class Challenge extends Component {
    constructor(props) {
        super(props)
        this.params = this.props.params
        this.regions = config.regions
        this.tiers = config.tiers

        let tempRegion = props.query.toLowerCase();
        if (!this.regions.includes(tempRegion)) {
            tempRegion = "world"
        }


        this.load = this.load.bind(this)
        this.error = this.error.bind(this)

        this.loadChallenge = this.loadChallenge.bind(this)
        this.loadChallenges = this.loadChallenges.bind(this)

        this.changeFilter = this.changeFilter.bind(this)
        this.showChallenge = this.showChallenge.bind(this)
        this.state = {
            totalLength: 250,
            message: -1,
            filter: tempRegion,
            challenge: {
                text: false,
                title: [],
                icon: 1,
                timestamp: Date.now() / 1000,
                challenge: {
                    id: 0,
                    parent: 0,
                    translation: {
                        name: "Loading",
                        description: "Loading"
                    }
                }
            }
        }
        this.challenge = "null"
        this.challenges = "null"
    }


    error() {
        this.setState({
            message: <Error></Error>,
        })
    }

    showChallenge(r) {
        document.title = "'" + r.challenge.translation.name + "' Challenge Overview, Thresholds and Leaderboards"
        this.setState({ challenge: r })
    }

    componentDidUpdate() {
        if (this.props.params !== this.params) {
            this.params = this.props;
            window.location.reload()
        }
    }

    componentDidMount() {
        this.load();
    }

    load() {
        document.title = "Loading..."
        get(`https://challenges.darkintaqt.com/api/v4/c/?id=${this.params.id}`, this.loadChallenge, this.error);
        get(`https://cdn.darkintaqt.com/lol/static/challenges-na1.json?t=${(new Date().getMonth() + 1).toString() + (new Date().getDate()).toString() + new Date().getFullYear().toString()}`, this.loadChallenges, this.error);
    }

    loadChallenge(challenge) {
        this.challenge = challenge;
        if (this.challenge !== "null" && this.challenges !== "null") {
            this.showChallenge(this.challenge)
        }
    }

    loadChallenges(challenges) {
        this.challenges = challenges;
        if (this.challenge !== "null" && this.challenges !== "null") {
            this.showChallenge(this.challenge)
        }
    }

    changeFilter(e) {
        if (e.target.id === "world") {
            let url = new URL(window.location)
            url.search = "";
            window.history.replaceState({}, "", url)
        } else {
            window.history.replaceState({}, "", "?region=" + e.target.id)
        }
        this.setState({ filter: e.target.id });
    }

    render() {
        const challenge = this.state.challenge
        const regions = this.regions
        const absoluteRegion = this.state.filter
        let region = absoluteRegion;
        if (absoluteRegion === "world") {
            region = window.region ?? "na"
        }

        function nameToURL(name) {
            if (typeof name !== "string") {
                return "error"
            }
            return name
        }

        function checkThresholds(thresholds) {
            let noThresholds = true;
            for (let index = 0; index < thresholds.length; index++) {
                if (thresholds[index] !== "-") {
                    noThresholds = false;
                }
            }
            return noThresholds
        }

        let filters = [<button key={"world"} onClick={this.changeFilter} className={start.filterOption + " " + start["world"]} id="world">Global</button>];
        for (let i = 0; i < regions.length; i++) {
            filters.push(<button key={i} onClick={this.changeFilter} className={start.filterOption + " " + start[regions[i]]} id={regions[i]}>{regions[i]}</button>)
        }


        let summoner = []
        let warnings = [];
        let thresholds = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
        let percentiles = {}
        for (let i = 0; i < this.tiers.length; i++) {
            percentiles[serverToMachineReadable(this.tiers[i])] = 1 - ((i + 1) / 10)

        }

        let icon = "https://lolcdn.darkintaqt.com/s/C-" + challenge.icon + "-master"

        if (challenge.challenge.id < 10 || challenge.challenge.id === 2022000) {
            if (challenge.challenge.id !== 0) {
                icon = "https://cdn.darkintaqt.com/lol/static/challenges/" + challenge.challenge.translation.name.toLowerCase().replace(" ", "") + ".svg"
            }
        }

        let totalLength = this.state.totalLength

        let isLoading = ""
        // Not loaded yet
        if (challenge.icon === 1) {
            isLoading = css.loading;
            let i = 0;
            while (i < 20) {
                i++;
                summoner.push(<tr className={css.loading + " IRON"} key={i}>
                    <td>{i}.</td>
                    <td>
                        <a href={"/loading"} onClick={goTo}>
                            <LazyLoadImage height={30} width={30} src={"https://lolcdn.darkintaqt.com/cdn/profileicon/29"} placeholderSrc={"https://lolcdn.darkintaqt.com/s/p-cb"} alt={""}></LazyLoadImage>
                            <p>Loading<span className={css.region}>-</span></p>
                        </a>
                    </td>
                    <td>...</td>
                    <td>-</td>
                </tr>)
            }

            icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        } else if (challenge.challenge.leaderboard === true || checkExists(challenge.challenge.tags["leaderboardManuallyEnabled"])) {
            thresholds = challenge.stats[serverToMachineReadable(region)]
            percentiles = challenge.stats["percentiles-" + serverToMachineReadable(region)]

            if (checkThresholds(thresholds)) {
                warnings.push(<div className={css.disabledMessage}>This challenge is not enabled in #{absoluteRegion}</div>)
            } else {

                // create list with summoners
                let summoners = []
                if (absoluteRegion === "world") {
                    let counters = {};
                    for (let i = 0; i < regions.length; i++) {
                        for (let ii = 0; ii < challenge.summoner[regions[i]].length; ii++) {
                            if (!checkExists(counters[regions[i]])) {
                                counters[regions[i]] = 1
                            }
                            challenge.summoner[regions[i]][ii].push(regions[i])
                            challenge.summoner[regions[i]][ii].push(counters[regions[i]])
                            summoners.push(challenge.summoner[regions[i]][ii])
                            counters[regions[i]]++
                        }

                    }
                    if (challenge.challenge.reversed === true) {
                        summoners.sort((a, b) => {
                            // Order by name if same value and position
                            if (a[1] === b[1]) {
                                if (b[5] === a[5]) {
                                    return a[0] < b[0] ? -1 : +(a[0] > b[0])
                                }
                                return a[5] - b[5]
                            }
                            return a[1] - b[1]
                        })
                    } else {
                        summoners.sort((a, b) => {
                            // Order by name if same value and position
                            if (a[1] === b[1]) {
                                if (b[5] === a[5]) {
                                    return a[0] < b[0] ? -1 : +(a[0] > b[0])
                                }
                                return a[5] - b[5]
                            }
                            return b[1] - a[1]
                        })
                    }
                } else {
                    summoners = challenge.summoner[absoluteRegion]
                    for (let i = 0; i < summoners.length; i++) {
                        summoners[i].push(absoluteRegion)
                        summoners[i].push(i + 1)

                    }
                }
                if (summoners.length === 0) {
                    summoner = []
                } else {
                    for (let i = 0; i < summoners.length; i++) {
                        if (i >= totalLength) {
                            break;
                        }
                        const player = summoners[i];
                        // let pos = css.normal;
                        // if (i === 0) {
                        //     pos = css.pos1
                        // } else if (i < 10) {
                        //     pos = css.top10
                        // } else if (i < 100) {
                        //     pos = css.top100
                        // }
                        let userlink = "/" + player[4] + "/" + nameToURL(player[0])

                        if (player[0] === "%") {
                            userlink = "/faq#h3"
                        }

                        summoner.push(<tr key={player[0] + player[4] + i} className={player[2]}>
                            <td>{i + 1}.</td>
                            <td>
                                <a href={userlink} onClick={goTo}>
                                    <LazyLoadImage height={30} width={30} src={"https://lolcdn.darkintaqt.com/cdn/profileicon/" + player[3]} placeholderSrc={"https://lolcdn.darkintaqt.com/s/p-cb"} alt={player[0] + "'s profile image"}></LazyLoadImage>
                                    <p>{player[0]}<span className={css.region}>{serverToHumanReadable(player[4])}</span></p>
                                </a>
                            </td>
                            <td>{player[2].toLowerCase()}</td>
                            <td>{beautifyNum(player[1], false)}</td>
                        </tr>)
                    }
                }
            }
        } else {
            thresholds = challenge.challenge.thresholds
            if (checkThresholds(thresholds)) {
                summoner = <div className={css.disabledMessage}>This challenge is not enabled in #{absoluteRegion}</div>
            } else {
                warnings.push(challenge.stats["percentiles-" + serverToMachineReadable(region)])
                warnings.push(<div className={css.disabledMessage}>Leaderboards aren't enabled for this challenge<br /><br /><span className={css.details}>Why? Because it is not possible to "scale" in this challenge, as it has a static highest achievable score. <br />If you think this challenge should have a leaderboard, please create an issue on <a href="https://github.com/DarkIntaqt/challenges/issues" target="_blank" rel="noreferrer">GitHub</a>.</span></div >)
            }
        }

        try {
            if (checkExists(challenge.challenge.tags["leaderboardManuallyEnabled"])) {
                warnings.push(<div className={css.disabledMessage} key={"exp"}>Leaderboards might be incorrect due to a missing API-leaderboard about this challenge. We still update rankings in this leaderboard, if you found a player who should be up here, just look them up.  </div>)
            }
        } catch (error) {
            console.warn(error);
        }
        if (challenge.challenge.reversed) {
            warnings.push(<div className={css.disabledMessage + " WHITEMESSAGE"} key={"reverse"}>This challenge is reversed. The less your points the better your placement</div>)
        }

        // if (summoner.length === 0) {
        //     warnings.push(<div className={css.disabledMessage + " GRANDMASTER"}>No high-ranked summoners yet<br /><br /><span className={css.details}>Due to API limitations we can only show players ranked MASTER+</span></div>)
        // }

        let thresholdTable = []
        for (let i = 1; i < thresholds.length; i++) {

            let lineThrough = { textDecoration: "none", fontStyle: "normal", textAlign: "center" };
            if (thresholds[i] === "-" && percentiles[intToTier(i - 1)] === 0) {
                lineThrough.textDecoration = "line-through";
                lineThrough.fontStyle = "italic";
            }

            thresholdTable.unshift(<div key={"threshold" + i} className={css.rowParentTableRow}>
                <p className={intToTier(i - 1)} style={{ color: "var(--type)", textAlign: "center", textDecoration: lineThrough["textDecoration"], fontStyle: lineThrough["fontStyle"] }}>{intToTier(i - 1)}</p>
                <p style={lineThrough}>{beautifyNum(thresholds[i])}</p>
                <p style={lineThrough}>{Math.round(percentiles[intToTier(i - 1)] * 1000) / 10}%</p>
            </div>)
        }

        let content = <Fragment>
            <div className={"MASTER " + css.c + " " + css.profile + " " + css["cid" + challenge.challenge.id]}>
                <img src={icon} alt="" />
                <h1>{challenge.challenge.translation.name} {challenge.timestamp
                    ? <span data-nosnippet>(Updated <Timestamp date={challenge.timestamp * 1000} />)</span>
                    : <span data-nosnippet></span>
                }</h1>
                <p className={"SILVER " + css.challengeDescription} style={{ margin: "0 5px 5px 10px", cursor: "auto" }}>{challenge.challenge.translation.description}

                    {challenge.title.length > 0
                        ? <Fragment><br />
                            <p className={css.availableTitle + " " + challenge.title[0][0]}><img src={"https://cdn.darkintaqt.com/lol/static/challenges/title.svg"} alt="Title" />{challenge.title[0][1]}</p>
                        </Fragment>
                        : null}

                </p>
            </div>

            <div className={start.filter + " " + start[this.state.filter]}>
                {filters}
            </div>

            <section className={css.leaderboardsLeft}>

                <div className={css.rowParent + " " + css.thresholdTable}>
                    <div className={css.seoArea}>
                        <h2>Thresholds</h2>
                        <span> How many players have reached a tier</span>
                    </div>
                    <div className={isLoading + " " + css.rowParentTable}>

                        <div className={css.rowParentTableRow + " " + css.rowParentTableRowHeading}>
                            <p>Tier</p>
                            <p>Points</p>
                            <p>%</p>
                        </div>

                        {thresholdTable}
                    </div>
                </div>

                {warnings}

                {challenge.text !== false ? <div className={css.rowParent + " object1000 " + css.field}>
                    <div className={css.seoArea}>
                        <h2>Info</h2>
                        <span> All you need to know about this challenge </span>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: challenge.text.replaceAll("\n", "<br />") }}></p>
                </div> : null
                }

            </section>

            <div className={css.rowParent + " " + css.zebra}>
                <div className={css.seoArea}>
                    <h2>"{challenge.challenge.translation.name}" Leaderboard</h2>
                    <span> {this.state.filter === "world" ? "Global Ranking" : "Regional Ranking"} </span>
                </div>
                <table className={isLoading}>
                    <tbody>
                        <tr>
                            <th>Position</th>
                            <th>Summonername</th>
                            <th>Tier</th>
                            <th>Value</th>
                        </tr>
                        {summoner}
                    </tbody>
                </table>
            </div>
        </Fragment >;

        if (this.state.message !== -1) {
            content = this.state.message;
        }

        return <div className={"object1000"}>
            {content}
        </div>
    }
}