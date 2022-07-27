import { Component, Fragment } from "react";
import Error from "./Error"
import { Navigate } from "react-router-dom"
import get from "../func/get"
import css from "../css/user.module.css"
import server from "../func/server"
import TimeAgo from 'react-timeago';
import { beautifyNum } from "../func/beautify"
import { intToTier, tierToInt } from "../func/tierFunctions";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default class Challenge extends Component {
    constructor(props) {
        super(props)
        this.params = props.params
        this.regions = ["br", "euw", "eune", "jp", "kr", "lan", "las", "na", "oc", "tr"];
        this.tiers = ["NONE", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]

        let tempRegion = props.query.toLowerCase();
        if (!this.regions.includes(tempRegion)) {
            tempRegion = "world"
        }

        this.error = this.error.bind(this)
        this.goTo = this.goTo.bind(this)
        this.changeFilter = this.changeFilter.bind(this)
        this.showChallenge = this.showChallenge.bind(this)
        this.state = {
            message: -1,
            filter: tempRegion,
            challenge: {
                icon: 1,
                timestamp: Date.now() / 1000,
                challenge: {
                    translation: {
                        name: "Loading",
                        description: "Loading"
                    }
                }
            }
        }
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

    componentDidMount() {
        document.title = "Loading..."
        get(`https://challenges.darkintaqt.com/api/v3/c/?id=${this.params.id}`, this.showChallenge, this.error);
    }

    goTo(e) {
        e.preventDefault();
        let loc = new URL(e.currentTarget.href);
        this.setState({ message: <Navigate to={loc["pathname"] + loc["search"]} replace={false}></Navigate> })
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
            return name.toLowerCase().replaceAll(" ", "")
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

        let filters = [<button key={"world"} onClick={this.changeFilter} className={css.world} id="world">Global</button>];
        for (let i = 0; i < regions.length; i++) {
            filters.push(<button key={i} onClick={this.changeFilter} className={css[regions[i]]} id={regions[i]}>{regions[i]}</button>)
        }

        let dynamic = {
            "gm": "", "c": "", "placeholder": <Fragment>
                <span> <i className="fa-solid fa-circle-info"></i></span>
                <div>
                    <p>This is a dynamic threshold. This means that this value adjusts itself automatically to the lowest value in the tier. To reach this tier, you need at least as many points or better. </p>
                </div>
            </Fragment>
        }

        let summoner = []
        let thresholds = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
        let percentiles = {}
        for (let i = 0; i < this.tiers.length; i++) {
            percentiles[server("machine", this.tiers[i])] = 1 - ((i + 1) / 10)

        }

        let icon = "https://lolcdn.darkintaqt.com/s/C-" + challenge.icon + "-master"

        // Not loaded yet
        if (challenge.icon === 1) {
            let i = 0;
            while (i < 20) {
                i++;
                summoner.push(<a className={css.row + " " + css.loading} href="#loading">
                    <p className={css.rowPosition}>#</p>
                    <p className={css.rowTitle}>
                        <LazyLoadImage height={30} width={30} src={"https://lolcdn.darkintaqt.com/s/p-cb"} placeholderSrc={"https://lolcdn.darkintaqt.com/s/p-cb"}></LazyLoadImage>
                        Loading</p>
                    <p className={css.tierImage}>...</p>
                    <p className={css.rowElement}>139</p>
                    <p className={css.rowPosition}>#</p>
                </a>)
            }

            icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        } else if (challenge.challenge.leaderboard === true || typeof challenge.challenge.tags["leaderboardManuallyEnabled"] !== "undefined") {
            thresholds = challenge.stats[server("machine", region)]
            percentiles = challenge.stats["percentiles-" + server("machine", region)]

            if (checkThresholds(thresholds)) {
                summoner = <div className={css.disabledMessage + " GRANDMASTER"}>This challenge is not enabled in #{absoluteRegion}</div>
            } else {
                if (thresholds[9] !== "-") {
                    dynamic["c"] = dynamic["placeholder"]
                }
                if (thresholds[8] !== "-") {
                    dynamic["gm"] = dynamic["placeholder"]
                }

                // create list with summoners
                let summoners = []
                if (absoluteRegion === "world") {
                    let counters = {};
                    for (let i = 0; i < regions.length; i++) {
                        for (let ii = 0; ii < challenge.summoner[regions[i]].length; ii++) {
                            if (typeof counters[regions[i]] === "undefined") {
                                counters[regions[i]] = 1
                            }
                            challenge.summoner[regions[i]][ii].push(regions[i])
                            challenge.summoner[regions[i]][ii].push(counters[regions[i]])
                            summoners.push(challenge.summoner[regions[i]][ii])
                            counters[regions[i]]++
                        }

                    }
                    summoners.sort((a, b) => {
                        // Order by name if same value and position
                        if (a[1] === b[1]) {
                            if (b[4] === a[4]) {
                                return a[0] < b[0] ? -1 : +(a[0] > b[0])
                            }
                            return a[4] - b[4]
                        }
                        return b[1] - a[1]
                    })
                } else {
                    summoners = challenge.summoner[absoluteRegion]
                    for (let i = 0; i < summoners.length; i++) {
                        summoners[i].push(absoluteRegion)
                        summoners[i].push(i + 1)

                    }
                }
                if (summoners.length === 0) {
                    summoner = <div className={css.disabledMessage + " GRANDMASTER"}>No high-ranked summoners yet<br /><br /><span className={css.details}>Due to API limitations we can only show players ranked MASTER+</span></div>
                } else {
                    for (let i = 0; i < summoners.length; i++) {
                        const player = summoners[i];
                        let pos = css.normal;
                        if (i === 0) {
                            pos = css.pos1
                        } else if (i < 10) {
                            pos = css.top10
                        } else if (i < 100) {
                            pos = css.top100
                        }
                        summoner.push(<a className={player[2] + " " + css.row} href={"/" + player[4] + "/" + nameToURL(player[0])} key={player[0] + player[3]} onClick={this.goTo}>
                            <p className={css.rowPosition}>#{i + 1}</p>
                            <p className={css.rowTitle}>
                                <LazyLoadImage height={30} width={30} src={"https://lolcdn.darkintaqt.com/s/p-" + (player[3] * 7).toString(16)} placeholderSrc={"https://lolcdn.darkintaqt.com/s/p-cb"}></LazyLoadImage>

                                {player[0]}<span className={css.region}>#{server("human", player[4])}</span></p>
                            <p className={css.tierImage}>{player[2].toLowerCase()}</p>
                            <p className={css.rowElement}>{beautifyNum(player[1], false)}</p>
                            <p className={css.rowPosition}>#{player[5]} in {server("human", player[4])}</p>
                        </a >)
                    }
                }
            }
        } else {
            thresholds = challenge.challenge.thresholds
            if (checkThresholds(thresholds)) {
                summoner = <div className={css.disabledMessage + " GRANDMASTER"}>This challenge is not enabled in #{absoluteRegion}</div>
            } else {
                percentiles = challenge.stats["percentiles-" + server("machine", region)]
                summoner = <div className={css.disabledMessage + " GRANDMASTER"}>Leaderboards aren't enabled for this challenge<br /><br /><span className={css.details}>Why? Because it is not possible to "scale" in this challenge, as it has a static highest achievable score. <br />If you think this challenge should have a leaderboard, please create an issue on <a href="https://github.com/DarkIntaqt/challenges/issues" target="_blank" rel="noreferrer">GitHub</a>.</span></div >
            }
        }
        let warnings = [];
        try {
            if (typeof challenge.challenge.tags["leaderboardManuallyEnabled"] !== "undefined") {
                warnings.push(<div className={css.disabledMessage + " GRANDMASTER"}>Experimental leaderboards<br /><br />The API don't provide any data about this challenge, so the summoners on this leaderboard are collected by a machine. If you know someone with a higher score, just look them up</div>)
            }
        } catch { }
        if (challenge.challenge.reversed) {
            warnings.push(<div className={css.disabledMessage + " WHITEMESSAGE"}>This challenge is reversed. The less your points the better your placement</div>)
        }

        let perc = []

        percentiles = (Object.fromEntries(Object.entries(percentiles).sort(function (a, b) {
            if (tierToInt(a[0]) < tierToInt(b[0])) {
                return 1
            } else {
                return -1
            }
        })))

        for (const percentile in percentiles) {
            if (Object.hasOwnProperty.call(percentiles, percentile) && percentile !== "NONE") {
                let nextTier = intToTier(tierToInt(percentile))
                if (nextTier === "NONE" && percentile === "CHALLENGER") {
                    percentiles["MAXED"] = 0
                    nextTier = "MAXED"
                }

                perc.push(<div key={percentile} className={css.percent + " " + percentile} style={{ "--width": (percentiles[percentile] - percentiles[nextTier]) }}></div>)
            }
        }

        let content = <Fragment>
            <div className={"MASTER " + css.c + " " + css.profile}>
                <img src={icon} alt="" />
                <h1>{challenge.challenge.translation.name} {challenge.timestamp
                    ? <span>(Updated <TimeAgo date={challenge.timestamp * 1000} />)</span>
                    : <span></span>
                }</h1>
                <h2 className={"SILVER"} style={{ margin: "0 5px 5px 10px", cursor: "auto" }}>{challenge.challenge.translation.description}</h2>
                <div className={css.thresholds}>
                    <div>Thresholds:</div>
                    <div className={"IRON"}><i className="fa-solid fa-circle"></i>{beautifyNum(thresholds[1])}</div>
                    <div className={"BRONZE"}><i className="fa-solid fa-circle"></i>{beautifyNum(thresholds[2])}</div>
                    <div className={"SILVER"}><i className="fa-solid fa-circle"></i>{beautifyNum(thresholds[3])}</div>
                    <div className={"GOLD"}><i className="fa-solid fa-circle"></i>{beautifyNum(thresholds[4])}</div>
                    <div className={"PLATINUM"}><i className="fa-solid fa-circle"></i>{beautifyNum(thresholds[5])}</div>
                    <div className={"DIAMOND"}><i className="fa-solid fa-circle"></i>{beautifyNum(thresholds[6])}</div>
                    <div className={"MASTER"}><i className="fa-solid fa-circle"></i>{beautifyNum(thresholds[7])}</div>
                    <div className={"GRANDMASTER"}><i className="fa-solid fa-circle"></i>{beautifyNum(thresholds[8])}{dynamic["gm"]}</div>
                    <div className={"CHALLENGER"}><i className="fa-solid fa-circle"></i>{beautifyNum(thresholds[9])}{dynamic["c"]}</div>
                </div>
            </div>
            <div className={css.percentiles}>
                <div className={css.challengePercentile}>
                    <div className={css.percentileHover}>
                        <div className={"IRON"}><i className="fa-solid fa-circle"></i>{Math.round(percentiles["IRON"] * 1000) / 10}%</div>
                        <div className={"BRONZE"}><i className="fa-solid fa-circle"></i>{Math.round(percentiles["BRONZE"] * 1000) / 10}%</div>
                        <div className={"SILVER"}><i className="fa-solid fa-circle"></i>{Math.round(percentiles["SILVER"] * 1000) / 10}%</div>
                        <div className={"GOLD"}><i className="fa-solid fa-circle"></i>{Math.round(percentiles["GOLD"] * 1000) / 10}%</div>
                        <div className={"PLATINUM"}><i className="fa-solid fa-circle"></i>{Math.round(percentiles["PLATINUM"] * 1000) / 10}%</div>
                        <div className={"DIAMOND"}><i className="fa-solid fa-circle"></i>{Math.round(percentiles["DIAMOND"] * 1000) / 10}%</div>
                        <div className={"MASTER"}><i className="fa-solid fa-circle"></i>{Math.round(percentiles["MASTER"] * 1000) / 10}%</div>
                        <div className={"GRANDMASTER"}><i className="fa-solid fa-circle"></i>{Math.round(percentiles["GRANDMASTER"] * 1000) / 10}%</div>
                        <div className={"CHALLENGER"}><i className="fa-solid fa-circle"></i>{Math.round(percentiles["CHALLENGER"] * 1000) / 10}%</div>
                    </div>
                    {perc}
                </div>
            </div>
            <div className={css.filter + " " + css[this.state.filter]}>
                {filters}
            </div>
            <div className={css.rowParent}>
                {warnings}
                <div className={css.rowDescriptions}>
                    <p className={css.rowPosition}>Position</p>
                    <p className={css.rowTitle}>Summonername</p>
                    <p className={css.tierImage}>Tier</p>
                    <p className={css.rowElement}>Value</p>
                    <p className={css.rowPosition}>Position in server</p>
                </div>
                {summoner}
            </div>
        </Fragment>;
        if (this.state.message !== -1) {
            content = this.state.message
        }

        return <div className={"object1000 " + css.cc}>
            {content}
        </div>
    }
}