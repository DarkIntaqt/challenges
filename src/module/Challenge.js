import { Component, Fragment } from "react";
import Error from "./Error"
import get from "../func/get"
import { getCache } from "../func/getCheckCache"
import css from "../css/user.module.css"
import { serverToHumanReadable, serverToMachineReadable } from "../func/server"
import Timestamp from "react-timestamps"
import { beautifyNum } from "../func/beautify.js"
import { intToTier } from "../func/tierFunctions";
import { LazyLoadImage } from "react-lazy-load-image-component";
import goTo from "../func/goTo.js";
import start from "../css/start.module.css"
// import showChallengePath from "../func/showChallengePath.js"
// import ShowChildChallenges from "../func/getChildChallenges";
import { checkExists } from "../func/arrayManipulationFunctions.js";
import config from "../config";

import { capitalize, strtolower, strtoupper } from "../func/stringManipulation";
import Wrapper from "./Wrapper";
//import VipBadge from "./VipBadge";
import VipBadge from "./VipBadge"
import Ad from "./Ad"
import { withTranslation } from "react-i18next";

//import excss from "../css/aboutChallenge.module.css"

class Challenge extends Component {
    constructor(props) {
        super(props)
        this.params = this.props.params
        this.regions = config.regions
        this.tiers = config.tiers

        let tempRegion = props.query.toLowerCase();
        if (!this.regions.includes(tempRegion)) {
            tempRegion = "world"
        }

        this.challenge = "null"
        this.challenges = "null"

        this.load = this.load.bind(this)
        this.error = this.error.bind(this)

        this.loadChallenge = this.loadChallenge.bind(this)
        this.loadChallenges = this.loadChallenges.bind(this)

        this.changeFilter = this.changeFilter.bind(this)
        this.showChallenge = this.showChallenge.bind(this)

        let challengePlaceholder = {
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
            },
        }

        const tempChallenge = getCache(`https://challenges.darkintaqt.com/api/v5/c/?id=${this.params.id}`)
        const tempChallenges = getCache(`https://challenges.darkintaqt.com/api/dynamic-data/serve?region=euw1&lang=${window.language}`)

        if (tempChallenge !== false && tempChallenges !== false) {
            this.challenges = tempChallenges
            this.challenge = tempChallenge
            challengePlaceholder = tempChallenge
            document.title = "'" + tempChallenge.challenge.translation.name + "' Challenge Overview and Leaderboard"
        }


        this.state = {
            totalLength: 250,
            message: -1,
            filter: tempRegion,
            challenge: challengePlaceholder,
            translation: props.t
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

    componentDidUpdate() {
        if (this.props.params !== this.params) {
            this.params = this.props;
            //window.location.reload()
            const props = this.props;

            this.params = this.props.params
            this.regions = config.regions
            this.tiers = config.tiers

            let tempRegion = props.query.toLowerCase();
            if (!this.regions.includes(tempRegion)) {
                tempRegion = "world"
            }

            this.challenge = "null"
            this.challenges = "null"

            this.load = this.load.bind(this)
            this.error = this.error.bind(this)

            this.loadChallenge = this.loadChallenge.bind(this)
            this.loadChallenges = this.loadChallenges.bind(this)

            this.changeFilter = this.changeFilter.bind(this)
            this.showChallenge = this.showChallenge.bind(this)

            let challengePlaceholder = {
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
                },
            }

            const tempChallenge = getCache(`https://challenges.darkintaqt.com/api/v5/c/?id=${this.params.id}`)
            const tempChallenges = getCache(`https://challenges.darkintaqt.com/api/dynamic-data/serve?region=euw1&lang=${window.language}`)

            if (tempChallenge !== false && tempChallenges !== false) {
                this.challenges = tempChallenges
                this.challenge = tempChallenge
                challengePlaceholder = tempChallenge
                document.title = "'" + tempChallenge.challenge.translation.name + "' Challenge Overview and Leaderboard"
            }


            this.setState({
                totalLength: 250,
                message: -1,
                filter: tempRegion,
                challenge: challengePlaceholder,
                translation: props.t
            });

            if (this.challenge === "null" || this.challenges === "null") {
                this.load();
            }
        }

    }

    componentDidMount() {
        if (this.challenge === "null" || this.challenges === "null")
            this.load();
    }

    load() {
        document.title = "Loading..."
        get(`https://challenges.darkintaqt.com/api/v5/c/?id=${this.params.id}`, this.loadChallenge, this.error);
        get(`https://challenges.darkintaqt.com/api/dynamic-data/serve?region=euw1&lang=${window.language}`, this.loadChallenges, this.error);
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
        try {
            const t = this.state.translation

            if (document.location.pathname.slice(-1) === "/") {
                return <Error></Error>
            }

            const challenge = JSON.parse(JSON.stringify(this.state.challenge));
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
                percentiles[serverToMachineReadable(this.tiers[i])] = Math.round(11 - (i + 1)) / 10;
            }

            let icon = "https://lolcdn.darkintaqt.com/cdn/np-token/" + challenge["icon_2"]

            if (challenge.challenge.id < 10 || challenge.challenge.id === 2022000 || challenge.challenge.id === 2023000) {
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

                icon = "https://lolcdn.darkintaqt.com/cdn/profileicon/-1"
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
                                    if (b[6] === a[6]) {
                                        return a[4] - b[4]
                                    }
                                    return a[6] - b[6]
                                }
                                return a[1] - b[1]
                            })
                        } else {
                            summoners.sort((a, b) => {
                                // Order by timestamp if same value and position
                                if (a[1] === b[1]) {
                                    if (b[6] === a[6]) {
                                        return a[4] - b[4]
                                    }
                                    return a[6] - b[6]
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
                            let userlink = "/" + player[6] + "/" + nameToURL(player[0])

                            if (player[0] === "%") {
                                userlink = "/faq#h3"
                            }

                            summoner.push(<tr key={player[0] + player[7] + i} className={intToTier(player[2])}>
                                <td>{i + 1}.</td>
                                <td>
                                    <a href={userlink} onClick={goTo}>
                                        {player[5] === 1 ? <VipBadge size={"22px"} position={"absolute"} margin={"20px 0 0 20px"} /> : null}
                                        <LazyLoadImage height={30} width={30} src={"https://lolcdn.darkintaqt.com/cdn/profileicon/" + player[3]} placeholderSrc={"https://lolcdn.darkintaqt.com/s/p-cb"} alt={player[0] + "'s profile image"}></LazyLoadImage>
                                        <p>{player[0]} <span className={css.region}>#{serverToHumanReadable(player[6])}</span></p>
                                    </a>
                                </td>
                                <td>{capitalize(t(strtolower(intToTier(player[2]))))}</td>
                                <td>{beautifyNum(player[1], false)}</td>
                            </tr>)
                        }
                    }
                }
            } else {
                thresholds = challenge.challenge.thresholds
                if (checkThresholds(thresholds)) {
                    summoner = <div className={css.disabledMessage}>{("This challenge isn't enabled in this {{region}}", { region: absoluteRegion })}</div>
                } else {
                    warnings.push(challenge.stats["percentiles-" + serverToMachineReadable(region)])
                    warnings.push(<div className={css.disabledMessage}>Leaderboards aren't enabled for this challenge<br /><br /><span className={css.details}>Why? Because it is not possible to "scale" in this challenge, as it has a static highest achievable score. <br />If you think this challenge should have a leaderboard, please create an issue on <a href="https://github.com/DarkIntaqt/challenges/issues" target="_blank" rel="noreferrer">GitHub</a>.</span></div >)
                }
            }

            try {
                if (checkExists(challenge.challenge.tags["leaderboardManuallyEnabled"])) {
                    warnings.push(<div className={css.disabledMessage} key={"exp"}>{t("Leaderboards might be incorrect due to a missing API-endpoint about this challenge. We still update rankings in this leaderboard, if you found a player who should be up here, just look them up.")}</div>)
                }
            } catch (error) {
                console.warn(error);
            }
            if (challenge.challenge.reversed) {
                warnings.push(<div className={css.disabledMessage + " WHITEMESSAGE"} key={"reverse"}>{t("This challenge is reversed. The less your points the better your placement")}</div>)
            }

            // if (summoner.length === 0) {
            //     warnings.push(<div className={css.disabledMessage + " GRANDMASTER"}>No high-ranked summoners yet<br /><br /><span className={css.details}>Due to API limitations we can only show players ranked MASTER+</span></div>)
            // }

            let thresholdTable = []
            for (let i = 1; i < thresholds.length; i++) {

                let lineThrough = { color: "#828282", textDecoration: "none", textAlign: "center" };
                if (thresholds[i] === "-" && percentiles[intToTier(i)] === 0) {
                    lineThrough.textDecoration = "line-through";
                } else {
                    lineThrough.color = "var(--type,#fff)"
                }

                thresholdTable.unshift(<div key={"threshold" + i} className={css.rowParentTableRow}>
                    <p className={intToTier(i)} style={lineThrough}>{strtoupper(t(strtolower(intToTier(i))))}</p>
                    <p style={lineThrough}>{beautifyNum(thresholds[i])}</p>
                    <p style={lineThrough}>{Math.round(percentiles[intToTier(i)] * 1000) / 10}%</p>
                </div>)
            }

            let content = <Fragment>
                <section className={"MASTER " + css.c + " " + css.profile + " " + css["cid" + challenge.challenge.id]}>
                    <img src={icon} alt={challenge.challenge.translation.name + " challenge logo"} />
                    <h1>{challenge.challenge.translation.name}</h1>
                    <p className={"SILVER " + css.challengeDescription} style={{ margin: "0 5px 5px 10px", cursor: "auto" }}>
                        {challenge.challenge.translation.description} {challenge.timestamp
                            ? <span data-nosnippet className={css.updated}>({t("Updated")} <Timestamp date={challenge.timestamp * 1000} />)</span>
                            : <span data-nosnippet className={css.updated}></span>
                        }

                        {challenge.title.length > 0
                            ? <Fragment><br />
                                <span className={css.availableTitle + " " + challenge.title[0][0]}><img src={"https://cdn.darkintaqt.com/lol/static/challenges/title.svg"} alt="Title" />{challenge.title[0][1]}</span>
                            </Fragment>
                            : null}

                    </p>

                </section>

                <section className={start.filter + " " + start[this.state.filter]}>
                    {filters}
                </section>

                <section className={css.leaderboardsLeft}>

                    <div className={css.rowParent + " " + css.thresholdTable}>
                        <div className={css.seoArea}>
                            <h2>{t("Thresholds")}</h2>
                            <span> {t("How many players have reached a tier")}</span>
                        </div>
                        <div className={isLoading + " " + css.rowParentTable}>

                            <div className={css.rowParentTableRow + " " + css.rowParentTableRowHeading}>
                                <p>{t("Tier")}</p>
                                <p>{t("Points")}</p>
                                <p>%</p>
                            </div>

                            {thresholdTable}
                        </div>
                    </div>

                    {warnings}

                    {challenge.text !== false ? <div className={css.rowParent + " object1000 " + css.field}>
                        <div className={css.seoArea}>
                            <h2>{t("Info")}</h2>
                            <span> {t("All you need to know about this challenge")} </span>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: "<p>" + challenge.text.replace(/---\n/ig, "</p><div class='" + css.line + "'></div><p>").replace(/\n/g, "<br />") + "</p>" }}></div>
                    </div> : null
                    }

                    {challenge.challenge.translation.name !== "Loading" ?
                        <div style={{ float: "left", flexWrap: "wrap", margin: "5px 0", width: "100%", display: "flex", justifyContent: "center" }}>
                            <Ad id={0}></Ad>
                        </div> : null}
                </section>

                <section className={css.rowParent + " " + css.zebra}>
                    <div className={css.seoArea}>
                        <h2>{t("\"{{challenge}}\" Leaderboard", { challenge: challenge.challenge.translation.name })}</h2>
                        <span> {this.state.filter === "world" ? t("Global Ranking") : t("Regional Ranking")} </span>
                    </div>
                    <table className={isLoading}>
                        <tbody>
                            <tr>
                                <th>{t("Position")}</th>
                                <th>{t("Summoner")}</th>
                                <th>{t("Tier")}</th>
                                <th>{t("Points")}</th>
                            </tr>
                            {summoner}
                        </tbody>
                    </table>
                </section>
            </Fragment >;

            if (this.state.message !== -1) {
                content = this.state.message;
            }

            return <Wrapper>
                {content}
            </Wrapper>
        } catch (e) {
            console.warn(e);
            return <p style={{ color: "white" }}>an error occurred</p>
        }
    }
}

export default withTranslation()(Challenge)