import { Component } from "react";
import Error from "./Error"
import { Navigate } from "react-router-dom"
import "../css/user.css"
import get from "../func/get"
import css from "../css/user.module.css";
import getChallenge from "../func/getChallenge";
import TimeAgo from 'react-timeago';
import getServer from "../func/server"
import { beautifyNum } from "../func/beautify"

export default class User extends Component {
    constructor(props) {
        super(props);
        this.server = ""; this.summonerJSON = "";
        this.loaded = 0;
        this.filter = "level"
        this.params = props.params;
        this.challengeJSON = {};
        this.addLoad = this.addLoad.bind(this);
        this.showUser = this.showUser.bind(this);
        this.error = this.error.bind(this);
        this.goTo = this.goTo.bind(this);
        this.sortChallenges = this.sortChallenges.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.loadingUI = window.loadingUI;
        this.addRegionChallenges = this.addRegionChallenges.bind(this)
        this.state = {
            extraStyle: { display: "block" },
            alphabet: "a-z",
            points: ["0", "1"],
            selections: {
                "img1": "https://cdn.darkintaqt.com/lol/static/missing/item.png",
                "img2": "https://cdn.darkintaqt.com/lol/static/missing/item.png",
                "img3": "https://cdn.darkintaqt.com/lol/static/missing/item.png",
                "statsl": { "tier": "UNRANKED", "challenge": ["...", "..."] },
                "statsm": { "tier": "UNRANKED", "challenge": ["...", "..."] },
                "statsr": { "tier": "UNRANKED", "challenge": ["...", "..."] }
            },
            filter: this.filter,
            name: <div className={"loading"} style={{
                width: props.params.user.length * 1.4 + "rem", height: "2rem"
            }}></div>,
            type: "UNRANKED",
            title: "",
            profileImage: "https://cdn.darkintaqt.com/lol/static/missing/item.png",
            challenges: this.loadingUI
        }
    }


    showUser(r) {

        // Cancel if the challenge config hasn't been loaded (yet)
        if (typeof window.challenges[this.server] === "undefined") {
            return
        }

        // save json to global json object to prevent requesting another ressource from the server
        this.challengeJSON = r


        document.title = r.name + "'s Challenge Progress Overview"

        let challenges = [];

        function getNextLevel(current) {
            let ranks = ["UNRANKED", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]
            for (let i = 0; i < ranks.length; i++) {
                if (current === ranks[i]) {
                    if (ranks[i] === "CHALLENGER") { return "CHALLENGER" }
                    return ranks[i + 1];
                }

            }
        }

        r.challenges = this.sortChallenges(r.challenges)

        // Loop through the challenges
        for (let i = 0; i < r.challenges.length; i++) {
            const challenge = r["challenges"][i];
            const c = getChallenge(challenge.id)

            let queueIds = []; // available gameModes
            let position;
            let p = 0; // current position when leaderboards are enabled
            let next; // threshold of next tier
            let nexttier = getNextLevel(challenge.tier); // next tier (e.g. iron => bronze)
            let leaderboardposition = ""; // set when player has a position and not just a percentile
            let type = challenge.tier.toLowerCase(); // for background

            // get threshold for dynamic leaderboards
            if (c.leaderboard === true && typeof challenge.position !== "undefined") {
                switch (challenge.tier) {
                    case "GRANDMASTER":
                        p = c["leaderboardThresholds"][3] ?? 0
                        break;
                    case "MASTER":
                        p = c["leaderboardThresholds"][5] ?? 0
                        break;
                    default:
                        p = 0
                        break;
                }
                position = "#" + beautifyNum(p + challenge.position) + " - ";
            }

            if (typeof c["thresholds"][nexttier] !== "undefined") {
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
                if (p + challenge.position === 1) {
                    // leaderboards, #1
                    nexttier = "FIRST";
                }
            }

            // set xxx time ago instead of position when the timestamp filter is set
            if (this.filter === "timestamp") {
                leaderboardposition = <span><TimeAgo date={challenge.achievedTimestamp}></TimeAgo></span>
            } else {
                leaderboardposition = <span>{position}Top {(Math.round(challenge.percentile * 10000) / 100)}%</span>
            }

            // set type to none to use images
            if (type === "undefined" || type === "unranked") {
                type = "none";
            }

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
                    }

                    if ([400, 420, 430, 440].includes(queue)) {
                        enabled["isSR"] = true;
                    }

                    if ([830, 840, 850].includes(queue)) {
                        enabled["isBot"] = true;
                    }
                }

                if (enabled["isAram"] && enabled["isSR"]) {
                    queueIds.push(<img key={0} src="https://cdn.darkintaqt.com/lol/static/lanes/FILL.png" alt="All modes" />)
                } else if (enabled["isAram"] && !enabled["isSR"]) {
                    queueIds.push(<img key={1} src="https://lolcdn.darkintaqt.com/cdn/ha.svg" alt="Aram games only" />)
                } else if (!enabled["isAram"] && enabled["isSR"]) {
                    queueIds.push(<img key={2} src="https://lolcdn.darkintaqt.com/cdn/sr.svg" alt="Summoners Rift games only" />)
                } else {
                    queueIds.push(<img key={3} src="https://lolcdn.darkintaqt.com/cdn/bot.png" alt="Bot games only" />)
                }
            }

            // push challenge to list
            challenges.push(<a className={challenge.tier + " " + css.challenge + " " + css[nexttier]} href={"/challenge/" + challenge.id + "?region=" + this.params.server} onClick={this.goTo} key={challenge.id} style={
                {
                    backgroundImage: "url(https://lolcdn.darkintaqt.com/s/_-" + type + ")"
                }}>
                <p className={css.title}>
                    {c.translation.name}
                    {leaderboardposition}
                </p>
                <p className={css.description}>{c.translation.description}</p>

                {queueIds}
                <div className={css.progress}>
                    <p className={css.text}>{beautifyNum(challenge.value)} / {beautifyNum(next)}</p>
                    <div className={css.indicator} style={{ width: "calc(122px * " + (challenge.value / next) + ")" }}></div>
                </div>
            </a>)

        }

        this.setState({
            found: true,
            type: r.type,
            title: r.title,
            points: r.points,
            name: r.name,
            selections: {
                "img1": "https://lolcdn.darkintaqt.com/s/C-" + r.selections["left"]["id"],
                "img2": "https://lolcdn.darkintaqt.com/s/C-" + r.selections["middle"]["id"],
                "img3": "https://lolcdn.darkintaqt.com/s/C-" + r.selections["right"]["id"],
                "statsl": r.selections["left"],
                "statsm": r.selections["middle"],
                "statsr": r.selections["right"],
            },
            profileImage: "https://lolcdn.darkintaqt.com/s/p-" + r.icon,
            challenges: challenges
        });

    }

    sortChallenges(challenges) {
        const filter = this.filter;

        function tierToInt(tier) {
            switch (tier) {
                case "UNRANKED":
                case "NONE":
                    return 0
                case "IRON":
                    return 1
                case "BRONZE":
                    return 2
                case "SILVER":
                    return 3
                case "GOLD":
                    return 4
                case "PLATINUM":
                    return 5
                case "DIAMOND":
                    return 6
                case "MASTER":
                    return 7
                case "GRANDMASTER":
                    return 8
                case "CHALLENGER":
                    return 9
                default:
                    return 0
            }
        }

        // TIER = tier -> percentile -> position if exists
        if (filter === "level") {
            challenges.sort(function (a, b) {
                if (tierToInt(a["tier"]) === tierToInt(b["tier"])) {
                    if (a["percentile"] === b["percentile"]) {
                        if (typeof a["position"] === "undefined") {
                            return 1;
                        } else {
                            if (typeof b["position"] === "undefined") {
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
                let nextLevelA = 1;

                let challenge = getChallenge(a["id"]);
                if (typeof challenge["thresholds"][getNextLevel(a["tier"])] !== "undefined") {
                    nextLevelA = challenge["thresholds"][getNextLevel(a["tier"])]
                } else {
                    nextLevelA = challenge["thresholds"][a["tier"]] ? challenge["thresholds"][a["tier"]] : 1;
                }
                if (challenge.tier === "CHALLENGER" && challenge.leaderboard === true) {
                    nextLevelA = challenge["leaderboardThresholds"][0] ?? 0
                }

                nextLevelA = a["value"] / nextLevelA;


                let nextLevelB = 1;
                challenge = getChallenge(b["id"]);

                if (typeof challenge["thresholds"][getNextLevel(b["tier"])] !== "undefined") {
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
        if (filter === "alphabetic-a-z") {
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
                    if (typeof a["position"] === "undefined") {
                        return 1;
                    } else {
                        if (typeof b["position"] === "undefined") {
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
        window.challenges[this.server] = e
        window.JSONPREQUEST = window.challenges[this.server]
        this.loaded++;
        if (this.loaded === 2) {
            this.showUser(this.summonerJSON)
        }
    }

    load() {
        let server = getServer(this.params.server)

        this.server = server

        if ("undefined" === typeof window.challenges[server] || (typeof window.challenges[server] !== "undefined" && window.challenges[server] === "")) {
            get(`https://cdn.darkintaqt.com/lol/static/challenges-${server}.json?t=${new Date().setHours(0, 0, 0, 0)}`, this.addRegionChallenges, function (e) {
                get('https://challenges.darkintaqt.com/api/?error=notloaded');
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            })
        } else {
            this.loaded++;
            window.JSONPREQUEST = window.challenges[server]
        }

        if (this.state.challenges === this.loadingUI) {
            get(`https://challenges.darkintaqt.com/api/v2/u/?name=${this.params.user}&server=${this.params.server}&t=${new Date().getTime()}`, this.addLoad, this.error);
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

    goTo(e) {
        e.preventDefault();
        let loc = new URL(e.currentTarget.href);
        loc = loc["pathname"] + loc["search"];
        this.setState({ challenges: <Navigate to={loc} replace={false}></Navigate> })
    }

    changeFilter(e) {
        this.filter = e.target.id;
        if (this.filter === "alphabetic-a-z" && this.state.alphabet === "a-z") {
            this.setState({
                alphabet: "z-a",
                filter: e.target.id
            })
            this.load()
            return
        }
        if (this.filter === "alphabetic-z-a" && this.state.alphabet === "z-a") {
            this.setState({
                alphabet: "a-z",
                filter: e.target.id
            })
            this.load()
            return
        }
        this.setState({ filter: e.target.id });
        this.load()
    }

    render() {

        return <div className="object1000">
            <div className={this.state.type + " " + css.profile} style={this.state.extraStyle}>
                <img src={this.state.profileImage} alt="" />
                <h1>{this.state.name}</h1>
                <h2 className={this.state.title["tier"]}><span dangerouslySetInnerHTML={{ __html: this.state.title["title"] }}></span><div><b>{this.state.title["tier"]} Tier Title</b><br />{this.state.title["description"]}<br /><i>Need {beautifyNum(this.state.title["threshold"])}</i></div></h2>
                <div className={css.selections}>
                    <div style={{ backgroundImage: "url('" + this.state.selections["img1"] + "')" }}>
                        <div className={this.state.selections["statsl"]["tier"]}><b>{this.state.selections["statsl"]["tier"]} Tier Token</b><br />{this.state.selections["statsl"]["challenge"][0]}<br /><i>Need {beautifyNum(this.state.selections["statsl"]["challenge"][1])}</i></div>
                    </div>
                    <div style={{ backgroundImage: "url('" + this.state.selections["img2"] + "')" }} >
                        <div className={this.state.selections["statsm"]["tier"]}><b>{this.state.selections["statsm"]["tier"]} Tier Token</b><br />{this.state.selections["statsm"]["challenge"][0]}<br /><i>Need {beautifyNum(this.state.selections["statsm"]["challenge"][1])}</i></div>
                    </div>
                    <div style={{ backgroundImage: "url('" + this.state.selections["img3"] + "')" }} >
                        <div className={this.state.selections["statsr"]["tier"]}><b>{this.state.selections["statsr"]["tier"]} Tier Token</b><br />{this.state.selections["statsr"]["challenge"][0]}<br /><i>Need {beautifyNum(this.state.selections["statsr"]["challenge"][1])}</i></div>
                    </div>
                </div>
            </div>
            <div className={this.state.type + " personalProgress"} style={this.state.extraStyle}>
                <span className={"progressText"}>{this.state.points[0]}/{this.state.points[1]}</span>
                <div className={"progress"}>
                    <div className={"indicator"} style={{ width: "calc(102px * " + (parseInt(this.state.points[0].replaceAll(".", ""))) / (parseInt(this.state.points[1].replaceAll(".", ""))) }}></div>
                </div>
            </div>
            <div className={"filter " + this.state.filter} style={this.state.extraStyle}>
                <button onClick={this.changeFilter} id="level">Rank</button>
                <button onClick={this.changeFilter} id="timestamp">Last updated</button>
                <button onClick={this.changeFilter} id="percentile">Leaderboard Position</button>
                <button onClick={this.changeFilter} id="levelup">Levelup</button>
                <button onClick={this.changeFilter} id={"alphabetic-" + this.state.alphabet}>{this.state.alphabet.toUpperCase()}</button>
            </div>
            <div className={css.parent}>
                {this.state.challenges}
            </div>
        </div>
    }
}