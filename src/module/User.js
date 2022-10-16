import { Component } from "react";
import Error from "./Error"
import get from "../func/get"
import css from "../css/user.module.css";
import challengeCSS from "../css/challengeObject.module.css"
import getChallenge from "../func/getChallenge";
import Timestamp from "react-timestamps"
import { serverToMachineReadable } from "../func/server"
import { beautifyNum } from "../func/beautify.ts"
import { intToTier, tierToInt } from "../func/tierFunctions";
import { toggleValue } from "../func/arrayManipulationFunctions.ts";
import goTo from "../func/goTo.js";
import { strtolower, capitalize } from "../func/stringManipulation.js"
import { checkExists } from "../func/arrayManipulationFunctions.ts"
import ChallengeObject from "./ChallengeObject";
import ProgressBar from "./ProgressBar";
import config from "../config";

import filterCSS from "../css/filter.module.css"

export default class User extends Component {
    constructor(props) {
        super(props);
        this.server = "";
        this.summonerJSON = "";
        this.loaded = 0;
        this.filter = "level"
        this.params = props.params;
        this.challengeJSON = {};
        this.addLoad = this.addLoad.bind(this);
        this.showUser = this.showUser.bind(this);
        this.error = this.error.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);
        this.changeExtraFilter = this.changeExtraFilter.bind(this)
        this.sortChallenges = this.sortChallenges.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.loadingUI = window.loadingUI;
        this.addRegionChallenges = this.addRegionChallenges.bind(this);
        this.filters = {
            "category": [], "type": [], "gamemode": []
        };

        const loadingImage = "https://cdn.darkintaqt.com/lol/static/missing/item.png"
        const loadingSelection = { "tier": "UNRANKED", "challenge": ["...", "..."] }

        this.state = {
            extraStyle: { display: "block" },
            expandFilterOptions: { display: "none" },
            alphabet: "a-z",
            points: ["0", "1"],
            selections: {
                "img1": loadingImage,
                "img2": loadingImage,
                "img3": loadingImage,
                "statsl": loadingSelection,
                "statsm": loadingSelection,
                "statsr": loadingSelection
            },
            filter: this.filter,
            name: <div className={css.loadinganimation} style={{
                width: props.params.user.length * 1.4 + "rem", height: "2rem", borderRadius: "5px"
            }}></div>,
            type: "UNRANKED",
            title: "",
            categories: {
                "COLLECTION": {
                    "level": "NONE",
                    "current": 0,
                    "max": 1
                },
                "EXPERTISE": {
                    "level": "NONE",
                    "current": 0,
                    "max": 1
                },
                "VETERANCY": {
                    "level": "NONE",
                    "current": 0,
                    "max": 1
                },
                "IMAGINATION": {
                    "level": "NONE",
                    "current": 0,
                    "max": 1
                },
                "TEAMWORK": {
                    "level": "NONE",
                    "current": 0,
                    "max": 1
                }
            },
            profileImage: loadingImage,
            challenges: this.loadingUI
        }
    }


    showUser(r) {

        // Cancel if the challenge config hasn't been loaded (yet)
        if (!checkExists(window.JSONPREQUEST)) {
            return
        }

        // save json to global json object to prevent requesting another ressource from the server
        this.challengeJSON = r


        document.title = r.name + "'s Challenge Progress Overview"

        let challenges = [];


        const searchedBefore = localStorage.getItem("_search")

        if (searchedBefore !== null) {

            let parsedList = false

            try {

                parsedList = JSON.parse(searchedBefore)

            } catch (error) {

                console.error(error);

            } finally {

                let skip = false

                for (let i = 0; i < parsedList.length; i++) {

                    if (parsedList[i][1] === r.name) { skip = true }

                }

                if (skip === false) {
                    parsedList.splice(0, 0, [this.params.server, r.name, Math.round(parseInt(r.icon, 16) / 7)])

                    if (parsedList.length > 5) {

                        parsedList = parsedList.slice(0, 5)

                    }

                    localStorage.setItem("_search", JSON.stringify(parsedList))

                }
            }
        } else {

            localStorage.setItem("_search", JSON.stringify([[this.params.server, r.name, Math.round(parseInt(r.icon, 16) / 7)]]))

        }



        function getNextLevel(current) {
            let ranks = ["UNRANKED", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]
            for (let i = 0; i < ranks.length; i++) {
                if (current === ranks[i]) {
                    if (ranks[i] === "CHALLENGER") { return "CHALLENGER" }
                    return ranks[i + 1];
                }

            }
        }

        if (this.filter === "titles") {
            const titles = r.titles;
            for (const titleid in titles) {
                if (Object.hasOwnProperty.call(titles, titleid)) {
                    const title = titles[titleid];
                    if (titleid === "1") {
                        challenges.push(<ChallengeObject
                            tier="NONE"
                            href={"/titles"}
                            title={title}
                            subtitle={<span>Achieved by 100%</span>}
                            description={"This is a default title. Everyone owns it. Actually it is not even rare, as everyone has unlocked it, so please don't be proud of this one"}
                            key={titleid}
                        />)
                        continue;
                    }
                    const challenge = getChallenge(parseInt(titleid.substring(0, titleid.length - 2)))
                    const tier = intToTier(parseInt(titleid.substring(titleid.length - 2)))
                    let percentage
                    try {
                        percentage = Math.round(challenge.percentiles[tier] * 1000) / 10
                    } catch (error) {
                        percentage = "0"
                    }
                    challenges.push(<ChallengeObject
                        tier={tier}
                        href={"/titles"}
                        title={title}
                        subtitle={<span>Achieved by {percentage}%</span>}
                        description={challenge.translation.description}
                        key={titleid}
                    />)
                }
            }
        } else {
            r.challenges = this.sortChallenges(r.challenges)
            // Loop through the challenges
            for (let i = 0; i < r.challenges.length; i++) {
                const challenge = r["challenges"][i];
                if (challenge.id < 10) {
                    continue
                }
                try {
                    const c = getChallenge(challenge.id)

                    if (
                        checkExists(c.tags["source"]) && (
                            (c.tags["source"] === "CHALLENGES" && this.filters.type.length > 0 && !this.filters.type.includes("progression"))
                            || (c.tags["source"] === "EOGD" && this.filters.type.length > 0 && !this.filters.type.includes("ingame"))
                            || (c.tags["source"] === "CAP_INVENTORY" && this.filters.type.length > 0 && !this.filters.type.includes("collect"))
                            || (c.tags["source"] === "CLASH" && this.filters.type.length > 0 && !this.filters.type.includes("clash"))
                            || (c.tags["source"] === "SUMMONER" && this.filters.type.length > 0 && !this.filters.type.includes("profile"))
                            || (c.tags["source"] === "ETERNALS" && this.filters.type.length > 0 && !this.filters.type.includes("eternals"))
                            || (c.tags["source"] === "RANKED" && this.filters.type.length > 0 && !this.filters.type.includes("ranked")))
                    ) { continue }

                    let queueIds = []; // available gameModes
                    let position;
                    let previousPositions = 1; // current position when leaderboards are enabled
                    let next; // threshold of next tier
                    let nexttier = getNextLevel(challenge.tier); // next tier (e.g. iron => bronze)
                    let leaderboardposition = ""; // set when player has a position and not just a percentile

                    // get threshold for dynamic leaderboards
                    if (c.leaderboard === true && checkExists(challenge.position)) {
                        switch (challenge.tier) {
                            case "GRANDMASTER":
                                previousPositions = c["leaderboardThresholds"][3] ?? 1
                                break;
                            case "MASTER":
                                previousPositions = c["leaderboardThresholds"][5] ?? 1
                                break;
                            default:
                                previousPositions = 1
                                break;
                        }
                        position = "#" + beautifyNum((previousPositions - 1) + challenge.position, false);
                        if (challenge.position <= 100 && checkExists(challenge["globalPosition"])) {
                            position = position + " (#" + challenge.globalPosition + " World)";
                        }
                        position += " - ";
                    }

                    if (checkExists(c["thresholds"][nexttier])) {
                        next = c["thresholds"][nexttier]
                    } else {
                        next = c["thresholds"][challenge.tier]
                    }

                    // add for leaderboard and rank if challenge is challenger
                    if (challenge.tier === "CHALLENGER") {
                        if (c.leaderboard === true) {
                            // leaderboards, not #1
                            next = c["leaderboardThresholds"][0] ?? 0
                            nexttier = "CROWN";
                        } else {
                            // No leaderboards, so maxed
                            nexttier = "MAXED"
                        }
                        if ((previousPositions - 1) + challenge.position === 1) {
                            // leaderboards, #1
                            nexttier = "FIRST";
                        }
                    }

                    // set xxx time ago instead of position when the timestamp filter is set
                    if (this.filter === "timestamp") {
                        leaderboardposition = <span><span className={challengeCSS.hideOnHover}><Timestamp date={challenge.achievedTimestamp} /></span><span className={challengeCSS.showOnHover}><Timestamp date={challenge.achievedTimestamp} type="static" /></span></span>
                    } else {
                        leaderboardposition = <span>{position}Top {(Math.round(challenge.percentile * 10000) / 100)}%</span>
                    }

                    let skip = false

                    if (c.queueIds.length > 0) {
                        let enabled = {
                            isAram: false,
                            isSR: false,
                            isBot: false
                        }

                        for (let i = 0; i < c.queueIds.length; i++) {
                            const queue = c.queueIds[i];
                            if ([450, 930, 860].includes(queue)) {
                                enabled["isAram"] = true;
                                if (this.filters.gamemode.length > 0 && !this.filters.gamemode.includes("aram")) {
                                    skip = true
                                }
                            }

                            if ([400, 420, 430, 440].includes(queue)) {
                                enabled["isSR"] = true;
                                if (this.filters.gamemode.length > 0 && !this.filters.gamemode.includes("summonersrift")) {
                                    skip = true
                                }
                            }

                            if ([830, 840, 850].includes(queue)) {
                                enabled["isBot"] = true;
                                if (this.filters.gamemode.length > 0 && !this.filters.gamemode.includes("bot")) {
                                    skip = true
                                }
                            }
                        }

                        if (enabled["isAram"] && enabled["isSR"]) {
                            queueIds.push(<img key={0} src="https://cdn.darkintaqt.com/lol/static/lanes/FILL.png" alt="All modes" />)
                        } else if (enabled["isAram"] && !enabled["isSR"]) {
                            queueIds.push(<img key={1} src={config.images.aram} alt="Aram games only" />)
                        } else if (!enabled["isAram"] && enabled["isSR"]) {
                            queueIds.push(<img key={2} src={config.images.summonersrift} alt="Summoners Rift games only" />)
                        } else {
                            queueIds.push(<img key={3} src={config.images.bot} alt="Bot games only" />)
                        }
                    } else if (this.filters.gamemode.length > 0) {
                        if (this.filters.gamemode.includes("aram") && [101000, 101300, 101200, 101100].includes(c.id)) {
                            // Pass
                        } else {
                            skip = true
                        }
                    }

                    if (skip === true) {
                        continue;
                    }

                    // push challenge to list
                    challenges.push(<ChallengeObject
                        tier={challenge.tier}
                        nexttier={nexttier}
                        title={c.translation.name}
                        subtitle={leaderboardposition}
                        description={c.translation.description}
                        href={"/challenge/" + challenge.id + "?region=" + this.params.server}
                        queueIds={queueIds}
                        progressCurrent={challenge.value}
                        progressNext={next}
                        key={challenge.id}
                    ></ChallengeObject>)
                } catch (e) {
                    console.warn(`Challenge not found ${challenge.id}`);
                    console.warn(e)
                }
            }
        }

        this.setState({
            type: r.type,
            title: r.title,
            points: r.points,
            name: r.name,
            categories: r.categoryPoints,
            selections: {
                "img1": "https://lolcdn.darkintaqt.com/s/C-" + r.selections["left"]["id"],
                "img2": "https://lolcdn.darkintaqt.com/s/C-" + r.selections["middle"]["id"],
                "img3": "https://lolcdn.darkintaqt.com/s/C-" + r.selections["right"]["id"],
                "statsl": r.selections["left"],
                "statsm": r.selections["middle"],
                "statsr": r.selections["right"],
            },
            profileImage: "https://lolcdn.darkintaqt.com/cdn/profileicon/" + Math.round(parseInt(r.icon, 16) / 7),
            challenges: challenges
        });

    }

    sortChallenges(challenges) {
        const filter = this.filter;

        // TIER = tier -> percentile -> position if exists
        if (filter === "level") {
            challenges.sort(function (a, b) {
                if (tierToInt(a["tier"]) === tierToInt(b["tier"])) {
                    if (a["percentile"] === b["percentile"]) {
                        if (!checkExists(a["position"])) {
                            return 1;
                        } else {
                            if (!checkExists(b["position"])) {
                                return -1
                            } else {
                                return a["position"] < b["position"] ? -1 : 1
                            }
                        }
                    } else {
                        return a["percentile"] < b["percentile"] ? -1 : 1
                    }
                }
                return tierToInt(a["tier"]) > tierToInt(b["tier"]) ? -1 : 1
            })
        }

        // LEVELUP
        if (filter === "levelup") {
            challenges.sort(function (a, b) {
                function getNextLevel(current) {
                    let ranks = ["UNRANKED", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]
                    for (let i = 0; i < ranks.length; i++) {
                        if (current === ranks[i]) {
                            if (ranks[i] === "CHALLENGER") { return "CHALLENGER" }
                            return ranks[i + 1];
                        }

                    }
                }
                let nextLevelA, nextLevelB

                let challenge = getChallenge(a["id"]);
                if (checkExists(challenge["thresholds"][getNextLevel(a["tier"])])) {
                    nextLevelA = challenge["thresholds"][getNextLevel(a["tier"])]
                } else {
                    nextLevelA = challenge["thresholds"][a["tier"]] ? challenge["thresholds"][a["tier"]] : 1;
                }
                if (challenge.tier === "CHALLENGER" && challenge.leaderboard === true) {
                    nextLevelA = challenge["leaderboardThresholds"][0] ?? 0
                }

                nextLevelA = a["value"] / nextLevelA;

                challenge = getChallenge(b["id"]);

                if (checkExists(challenge["thresholds"][getNextLevel(b["tier"])])) {
                    nextLevelB = challenge["thresholds"][getNextLevel(b["tier"])]
                } else {
                    nextLevelB = challenge["thresholds"][b["tier"]] ? challenge["thresholds"][b["tier"]] : 1;
                }
                if (challenge.tier === "CHALLENGER" && challenge.leaderboard === true) {
                    nextLevelB = challenge["leaderboardThresholds"][0] ?? 0
                }
                nextLevelB = b["value"] / nextLevelB;

                if (nextLevelA >= 1) {
                    return 5
                }
                if (nextLevelB >= 1) {
                    return -5
                }

                return Math.round(nextLevelA * 50) > Math.round(nextLevelB * 50) ? -1 : 1

            })
        }

        // ALPHABETIC
        if (filter === "alphabetic-a-z" || filter === "titles") {
            challenges.sort(function (a, b) {
                const challenge = [getChallenge(a["id"]), getChallenge(b["id"])]
                return challenge[0]["translation"]["name"] < challenge[1]["translation"]["name"] ? -1 : +(challenge[0]["translation"]["name"] > challenge[1]["translation"]["name"])
            })
        }
        if (filter === "alphabetic-z-a") {
            challenges.sort(function (a, b) {
                const challenge = [getChallenge(a["id"]), getChallenge(b["id"])]
                return challenge[0]["translation"]["name"] > challenge[1]["translation"]["name"] ? -1 : +(challenge[0]["translation"]["name"] > challenge[1]["translation"]["name"])
            })
        }

        // POSITION
        if (filter === "percentile") {
            challenges.sort(function (a, b) {
                if (a["percentile"] === b["percentile"]) {
                    if (!checkExists(a["position"])) {
                        return 1;
                    } else {
                        if (!checkExists(b["position"])) {
                            return -1
                        } else {
                            return a["position"] < b["position"] ? -1 : 1
                        }
                    }
                }
                return a["percentile"] < b["percentile"] ? -1 : 1
            })
        }

        // TIMESTAMP
        if (filter === "timestamp") {
            challenges.sort(function (a, b) {
                if (a["achievedTimestamp"] === b["achievedTimestamp"]) {
                    return 0
                } else {
                    return a["achievedTimestamp"] > b["achievedTimestamp"] ? -1 : 1
                }
            })
        }

        return challenges
    }

    error(e, c) {
        this.setState({
            challenges: <Error message={e}></Error>,
            extraStyle: { display: "none" }
        })
    }

    addRegionChallenges(e) {
        window.JSONPREQUEST = e
        this.loaded++;
        if (this.loaded === 2) {
            this.showUser(this.summonerJSON)
        }
    }

    load() {
        let server = serverToMachineReadable(this.params.server)

        this.server = server

        get(`https://cdn.darkintaqt.com/lol/static/challenges-${server}.json?t=${(new Date().getMonth() + 1).toString() + (new Date().getDate()).toString() + new Date().getFullYear().toString()}`, this.addRegionChallenges, function (e) {
            get('https://challenges.darkintaqt.com/api/?error=notloaded');
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        })

        if (this.state.challenges === this.loadingUI) {
            get(`https://challenges.darkintaqt.com/api/v3/u/?name=${this.params.user}&server=${this.params.server}`, this.addLoad, this.error);
        } else {
            this.showUser(this.challengeJSON)
        }
    }

    addLoad(e) {
        this.summonerJSON = e;
        this.loaded++;
        if (this.loaded === 2) {
            this.showUser(e)
        }
    }

    componentDidMount() {
        document.title = "Loading..."
        this.load()
    }


    changeExtraFilter(e) {
        if (this.state.challenges !== window.loadingUI) {
            const toggle = toggleValue(this.filters[e.target.getAttribute("type")], e.target.id)

            if (toggle.method === true) {

                e.target.classList.add(filterCSS["selected"])

            } else {

                e.target.classList.remove(filterCSS["selected"])

            }

            // re-render the challenges displayed
            this.load()
        }
    }

    changeFilter(e) {
        if (this.state.challenges !== window.loadingUI) {
            const button = e.currentTarget

            if (this.filter === button.id) {
                return
            }

            if (this.filter === "alphabetic-a-z") {
                document.getElementById("alphabetic-z-a").classList.remove(filterCSS["selected"])
            } else if (this.filter === "alphabetic-z-a") {
                document.getElementById("alphabetic-a-z").classList.remove(filterCSS["selected"])
            } else {
                document.getElementById(this.filter).classList.remove(filterCSS["selected"])
            }

            button.classList.add(filterCSS["selected"])



            this.filter = button.id



            if (this.filter === "alphabetic-a-z" && this.state.alphabet === "a-z") {
                this.setState({
                    alphabet: "z-a",
                    filter: e.currentTarget.id
                })
                this.load()
                return
            }
            if (this.filter === "alphabetic-z-a" && this.state.alphabet === "z-a") {
                this.setState({
                    alphabet: "a-z",
                    filter: e.currentTarget.id
                })
                this.load()
                return
            }

            this.setState({ filter: e.currentTarget.id });
            this.load()
        }
    }

    toggleFilters() {
        if (this.state.expandFilterOptions.display === "none") {
            this.setState({ expandFilterOptions: { display: "block" } })
        } else {
            this.setState({ expandFilterOptions: { display: "none" } })
        }
    }

    render() {
        const profiletext = "view " + this.state.name + "'s profile on u.gg";

        return <div className="object1000">
            <div className={this.state.type + " " + css.profile} style={this.state.extraStyle}>
                <img src={this.state.profileImage} alt="" />
                <h1>{this.state.name}
                    {typeof this.state.name === "object" ? null : <a href={"https://u.gg/lol/profile/" + this.server + "/" + decodeURI(strtolower(this.state.name)) + "/overview"} target="_blank" rel="noreferrer nofollow" className={css.uggarea}><img className={css.ugglogo} src="https://cdn.darkintaqt.com/lol/static/challenges/ugg.svg" alt={profiletext} title={profiletext}></img></a>}
                </h1>
                {this.state.title["title"] !== "<span style='opacity:0;'>No title</span>" ? <h2 className={this.state.title["tier"]}><span dangerouslySetInnerHTML={{ __html: this.state.title["title"] }}></span><div><b>{capitalize(this.state.title["tier"])} Title</b><br />{this.state.title["description"]}<br /><br /><i>Need {beautifyNum(this.state.title["threshold"])}</i></div></h2> : ''}
                <div className={css.selections}>
                    <div style={{ backgroundImage: "url('" + this.state.selections["img1"] + "')" }}>
                        <div className={this.state.selections["statsl"]["tier"]}><b>{capitalize(this.state.selections["statsl"]["tier"])} Token</b><br />{this.state.selections["statsl"]["challenge"][0]}<br /><br /><i>Need {beautifyNum(this.state.selections["statsl"]["challenge"][1])}</i></div>
                    </div>
                    <div style={{ backgroundImage: "url('" + this.state.selections["img2"] + "')" }} >
                        <div className={this.state.selections["statsm"]["tier"]}><b>{capitalize(this.state.selections["statsm"]["tier"])} Token</b><br />{this.state.selections["statsm"]["challenge"][0]}<br /><br /><i>Need {beautifyNum(this.state.selections["statsm"]["challenge"][1])}</i></div>
                    </div>
                    <div style={{ backgroundImage: "url('" + this.state.selections["img3"] + "')" }} >
                        <div className={this.state.selections["statsr"]["tier"]}><b>{capitalize(this.state.selections["statsr"]["tier"])} Token</b><br />{this.state.selections["statsr"]["challenge"][0]}<br /><br /><i>Need {beautifyNum(this.state.selections["statsr"]["challenge"][1])}</i></div>
                    </div>
                </div>
            </div>


            <div className={css.categories}>

                <div className={css.category + " " + this.state.type}>

                    <p>
                        <img src={"https://cdn.darkintaqt.com/lol/static/challenges/crystal.svg"} alt="crystal" />
                        Crystal
                    </p>
                    <ProgressBar
                        width={100}
                        progress={parseInt(this.state.points[0].replaceAll(".", ""))}
                        max={parseInt(this.state.points[1].replaceAll(".", ""))}
                    />
                </div>

                <div className={css.category + " " + this.state.categories.COLLECTION.level}>

                    <p>
                        <img src={config.images.collection} alt="collection" />
                        Collection
                    </p>
                    <ProgressBar
                        width={100}
                        progress={this.state.categories.COLLECTION.current}
                        max={this.state.categories.COLLECTION.max}
                    />
                </div>

                <div className={css.category + " " + this.state.categories.EXPERTISE.level}>
                    <p>
                        <img src={config.images.expertise} alt="expertise" />
                        Expertise
                    </p>
                    <ProgressBar
                        width={100}
                        progress={this.state.categories.EXPERTISE.current}
                        max={this.state.categories.EXPERTISE.max}
                    />
                </div>

                <div className={css.category + " " + this.state.categories.VETERANCY.level}>

                    <p>
                        <img src={config.images.veterancy} alt="Veterancy" />
                        Veterancy
                    </p>
                    <ProgressBar
                        width={100}
                        progress={this.state.categories.VETERANCY.current}
                        max={this.state.categories.VETERANCY.max}
                    />
                </div>

                <div className={css.category + " " + this.state.categories.IMAGINATION.level}>

                    <p>
                        <img src={config.images.imagination} alt="Imagination" />
                        Imagination
                    </p>
                    <ProgressBar
                        width={100}
                        progress={this.state.categories.IMAGINATION.current}
                        max={this.state.categories.IMAGINATION.max}
                    />
                </div>

                <div className={css.category + " " + this.state.categories.TEAMWORK.level}>

                    <p>
                        <img src={config.images.teamwork} alt="Teamwork" />
                        Teamwork
                    </p>
                    <ProgressBar
                        width={100}
                        progress={this.state.categories.TEAMWORK.current}
                        max={this.state.categories.TEAMWORK.max}
                    />
                </div>

            </div>

            <div className={filterCSS.filter}>
                <div className={filterCSS.selectors + " clearfix"}>
                    <p className={filterCSS.info}>Filter</p>
                    <div className={filterCSS.category} category="category">
                        <p className={filterCSS.cheading}>Order by</p>

                        <button onClick={this.changeFilter} id="level" className={filterCSS["selected"]}>
                            <i className="fa-solid fa-ranking-star"></i>
                            Rank
                        </button>

                        <button onClick={this.changeFilter} id="timestamp">
                            <i className="fa-regular fa-clock"></i>
                            Last upgraded
                        </button>

                        <button onClick={this.changeFilter} id="percentile">
                            <i className="fa-solid fa-hashtag"></i>
                            Leaderboard Position
                        </button>

                        <button onClick={this.changeFilter} id="levelup">
                            <i className="fa-solid fa-arrow-up-right-dots"></i>
                            Closest Levelup
                        </button>

                        <button onClick={this.changeFilter} id={"alphabetic-" + this.state.alphabet}>
                            <i className={"fa-solid fa-arrow-down-" + this.state.alphabet}></i>
                            {this.state.alphabet.toUpperCase()}
                        </button>

                    </div>


                    <div className={filterCSS.category} category="category">
                        <p className={filterCSS.cheading}>Gamemode</p>

                        <button onClick={this.changeExtraFilter} id="summonersrift" type="gamemode">
                            <img src={config.images.summonersrift} alt="" />
                            Summoners Rift
                        </button>

                        <button onClick={this.changeExtraFilter} id="aram" type="gamemode">
                            <img src={config.images.aram} alt="" />
                            ARAM
                        </button>

                        <button onClick={this.changeExtraFilter} id="bot" type="gamemode">
                            <img src={config.images.bot} alt="" />
                            Coop vs. AI
                        </button>

                    </div>

                </div>
            </div>




            <div className={css.parent + " " + css.flexWidth}>
                {this.state.challenges}
            </div>
            {typeof this.state.name === "object" ? null : <p className={css.legal}><span data-nosnippet>The U.GG logo belongs to U.GG. Read more <a href="/faq#h4" onClick={goTo}>here</a>. <br />Click <a href="/faq" onClick={goTo}>here</a> to get any questions aobut this page answered. </span></p>}
        </div>
    }
}
