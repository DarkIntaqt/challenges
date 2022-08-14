import { Component } from "react"
import get from "../func/get"
import getServer from "../func/server"
import css from "../css/user.module.css"
import challengeCSS from "../css/challenges.module.css"
import getChallenge from "../func/getChallenge"
import generateChallengePointElement from "../func/generateChallengePointElement"
import goTo from "../func/goTo.js";

export default class Challenges extends Component {
    constructor(props) {
        super(props);
        this.load = this.load.bind(this)
        this.toLoad = { "content": [], "leaderboards": [] };
        this.loaded = this.loaded.bind(this);
        this.loadChallenges = this.loadChallenges.bind(this)
        this.loadLeaderboards = this.loadLeaderboards.bind(this)
        this.changeFilter = this.changeFilter.bind(this)
        this.showChallenges = this.showChallenges.bind(this)
        this.filter = { "category": [], "type": [], "gamemode": [] }
        this.searchFor = "";
        this.search = this.search.bind(this)
        this.state = {
            challengePoints: [],
            challenges: window.loadingUI
        }
    }

    load() {
        let server = getServer("machine", window.region)
        this.server = server;

        if ("undefined" === typeof window.challengeLeaderboards || (typeof window.challengeLeaderboards !== "undefined" && window.challengeLeaderboards === "")) {
            get("https://challenges.darkintaqt.com/api/v3/c/?id=0", this.loadLeaderboards)
        } else {
            this.loadLeaderboards(window.challengeLeaderboards)
        }

        get(`https://cdn.darkintaqt.com/lol/static/challenges-${server}.json?t=${(new Date().getMonth() + 1).toString() + (new Date().getDate()).toString() + new Date().getFullYear().toString()}`, this.loadChallenges)

    }

    loaded(type, content) {
        this.toLoad[type] = content;
        if (this.toLoad.content.length > 0 && Object.entries(this.toLoad.leaderboards).length > 0) {
            this.showChallenges(this.toLoad.content)
        }
    }

    loadChallenges(content) {
        this.loaded("content", content)
    }

    loadLeaderboards(content) {
        window.challengeLeaderboards = content
        this.loaded("leaderboards", content)
    }

    showChallenges(challengeData) {
        document.title = "All League of Legends Challenges Overview"
        window.JSONPREQUEST = challengeData

        let challenges = challengeData;

        challenges.sort(function (a, b) {
            return a["translation"]["name"] < b["translation"]["name"] ? -1 : +(a["translation"]["name"] > b["translation"]["name"])
        })

        let challengeObject = [];

        function checkFor(variable) {
            if (typeof variable === "undefined") {
                return false
            }
            return true
        }
        for (let i = 0; i < challenges.length; i++) {
            const challenge = challenges[i];
            if (challenge.id < 10) {
                if (challenge.id === 0) {
                    if (this.filter.category.length === 0 && this.filter.type.length === 0 && this.filter.gamemode.length === 0 && this.searchFor.length === 0) {
                        challengeObject.unshift(generateChallengePointElement(challenge, this.toLoad.leaderboards))
                    }
                } else {
                    continue
                }
            }
            let highestTier = "NONE", queueIds = [], parentName = "crystal", obtainable = [];
            let ranks = ["NONE", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
            for (let i2 = 1; i2 < ranks.length; i2++) {
                const rank = ranks[i2];
                if (typeof challenge.thresholds[rank] !== "undefined") {
                    highestTier = ranks[i2]
                }
            }

            try {
                if (checkFor(challenge.tags["parent"])) {
                    let c = 0;
                    let parentChallengeId = parseInt(challenge.tags["parent"])
                    while (c < 10) {
                        let currentChallenge = getChallenge(parentChallengeId)
                        if (checkFor(currentChallenge["tags"]["parent"]) && currentChallenge.id > 10) {
                            parentChallengeId = parseInt(getChallenge(parentChallengeId)["tags"]["parent"])
                        } else {
                            c = 10;
                        }
                    }
                    parentName = getChallenge(parentChallengeId)["translation"]["name"]
                } else if ([600006, 600010, 600011, 0].includes(challenge.id)) {
                    parentName = "legacy"
                } else if (checkFor(challenge.tags["isCapstone"])) {
                    parentName = challenge.translation.name
                } else {
                    parentName = "Error LL77"
                }
                if (challenge.tags["source"] === "CHALLENGES") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("progression")) {
                        continue
                    }
                    obtainable.push(<div key={crypto.randomUUID()}>
                        <p>Obtainable by progressing challenges</p>
                        <i className="fa-solid fa-angles-up"></i>
                    </div>)
                }
                if (challenge.tags["source"] === "EOGD") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("ingame")) {
                        continue
                    }
                    obtainable.push(<div key={crypto.randomUUID()}>
                        <p>Obtainable by playing games</p>
                        <i className="fa-solid fa-play"></i>
                    </div>)
                }
                if (challenge.tags["source"] === "CAP_INVENTORY") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("collect")) {
                        continue
                    }
                    obtainable.push(<div key={crypto.randomUUID()}>
                        <p>Obtainable by collecting items</p>
                        <i className="fa-solid fa-box-open"></i>
                    </div>)
                }
                if (challenge.tags["source"] === "CLASH") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("clash")) {
                        continue
                    }
                    obtainable.push(<div key={crypto.randomUUID()}>
                        <p>Obtainable by playing clash</p>
                        <img src="https://cdn.darkintaqt.com/lol/static/challenges/clash.webp" alt="" />
                    </div>)
                }
                if (challenge.tags["source"] === "SUMMONER") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("profile")) {
                        continue
                    }
                    obtainable.push(<div key={crypto.randomUUID()}>
                        <p>Obtainable by leveling up your profile</p>
                        <i className="fa-solid fa-user"></i>
                    </div>)
                }
                if (challenge.tags["source"] === "ETERNALS") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("eternals")) {
                        continue
                    }
                    obtainable.push(<div key={crypto.randomUUID()}>
                        <p>Obtainable by progressing eternals</p>
                        <img src="https://cdn.darkintaqt.com/lol/static/challenges/eternals.webp" alt="" />
                    </div>)
                }
                if (challenge.tags["source"] === "RANKED") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("ranked")) {
                        continue
                    }
                    obtainable.push(<div key={crypto.randomUUID()}>
                        <p>Obtainable by playing ranked</p>
                        <i className="fa-solid fa-ranking-star"></i>
                    </div>)
                }
            } catch (error) {
                console.warn(error)
            }

            if (challenge.queueIds.length > 0) {
                let enabled = {
                    isAram: false,
                    isSR: false,
                    isBot: false
                }

                for (let i = 0; i < challenge.queueIds.length; i++) {
                    const queue = challenge.queueIds[i];
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
                    queueIds.push(<div key={crypto.randomUUID()}>
                        <p>All modes</p>
                        <img key={0} src="https://cdn.darkintaqt.com/lol/static/lanes/FILL.png" alt="All modes" />
                    </div>)
                } else if (enabled["isAram"] && !enabled["isSR"]) {
                    if (this.filter.gamemode.length > 0 && !this.filter.gamemode.includes("aram")) {
                        continue
                    }
                    queueIds.push(<div key={crypto.randomUUID()}>
                        <p>ARAM games only</p>
                        <img key={1} src="https://lolcdn.darkintaqt.com/cdn/ha.svg" alt="Aram games only" />
                    </div>)
                } else if (!enabled["isAram"] && enabled["isSR"]) {
                    if (this.filter.gamemode.length > 0 && !this.filter.gamemode.includes("summonersrift")) {
                        continue
                    }
                    queueIds.push(<div key={crypto.randomUUID()}>
                        <p>Summoners Rift only</p>
                        <img key={2} src="https://lolcdn.darkintaqt.com/cdn/sr.svg" alt="Summoners Rift games only" />
                    </div>)
                } else {
                    if (this.filter.gamemode.length > 0 && !this.filter.gamemode.includes("bot")) {
                        continue
                    }
                    queueIds.push(<div key={crypto.randomUUID()}>
                        <p>Bot games only</p>
                        <img key={3} src="https://lolcdn.darkintaqt.com/cdn/bot.png" alt="Bot games only" />
                    </div>)
                }
            } else if (this.filter.gamemode.length > 0) {
                continue
            }

            // Skip to next element if filter is on and not on element
            if (this.filter.category.length > 0 && !this.filter.category.includes(parentName.toLowerCase().replaceAll(" ", ""))) {
                continue
            }

            // getChallenge(parseInt(challenge.parentCategory))

            if (this.searchFor !== "" && (challenge.translation.name.toLowerCase().search(this.searchFor.toLowerCase()) === -1 && challenge.translation.description.toLowerCase().search(this.searchFor.toLowerCase()) === -1)) {
                continue
            }

            challengeObject.push(<a className={highestTier + " " + css.challenge + " " + css.CROWN + " " + css.overview} href={"/challenge/" + challenge.id} onClick={goTo} key={"cid" + challenge.id}>
                <p className={css.title}>
                    {challenge.translation.name}
                    <span>{parentName}</span>
                </p>
                <p className={css.description}>{challenge.translation.description}</p>
                <div className={css.tags}>
                    <div>
                        <p>{parentName.charAt(0).toUpperCase() + parentName.slice(1)} Category</p>
                        <img src={"https://cdn.darkintaqt.com/lol/static/challenges/" + parentName.toLowerCase().replaceAll(" ", "") + ".webp"} alt="" />
                    </div>
                    {queueIds}
                    {obtainable}
                </div>

            </a>)
        }
        this.setState({ challenges: challengeObject })
    }

    componentDidMount() {
        document.title = "Loading..."
        this.load()
    }

    changeFilter(e) {
        let button = e.currentTarget;
        let c = button.innerText.toLowerCase().replaceAll(" ", "")

        let category = this.filter[button.parentNode.getAttribute("category")];
        if (button.classList.length > 0) {
            button.classList.remove(challengeCSS["selected"])
            category = category.filter(x => x !== c);
        } else {
            button.classList.add(challengeCSS["selected"])
            category.push(c)
        }

        switch (button.parentNode.getAttribute("category")) {
            case "category":
                this.filter = {
                    "category": category,
                    "type": this.filter.type,
                    "gamemode": this.filter.gamemode
                }

                break;
            case "type":
                this.filter = {
                    "type": category,
                    "category": this.filter.category,
                    "gamemode": this.filter.gamemode
                }

                break;
            default:
                this.filter = {
                    "gamemode": category,
                    "type": this.filter.type,
                    "category": this.filter.category
                }

                break;
        }
        this.showChallenges(window.JSONPREQUEST)
    }

    search(e) {
        this.searchFor = e.target.value;
        this.showChallenges(window.JSONPREQUEST)
    }

    render() {

        let challengePoints = this.state.challengePoints

        return <div className={"object1000"}>
            <div className={challengeCSS.heading}>
                <h1>List of all Challenges</h1>
                <h2>Overview and how to obtain them</h2>
            </div>
            <div className={challengeCSS.filter}>
                <input type="text" placeholder="Search for challenge" onKeyUp={this.search} />
                <div className={challengeCSS.selectors + " clearfix"}>
                    <p className={challengeCSS.info}>Filter (multiple choices)</p>
                    <div className={challengeCSS.category} category="category">
                        <p className={challengeCSS.cheading}>Category</p>
                        <button onClick={this.changeFilter}>
                            <img src={"https://cdn.darkintaqt.com/lol/static/challenges/teamwork.webp"} alt="" />
                            Teamwork
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src={"https://cdn.darkintaqt.com/lol/static/challenges/imagination.webp"} alt="" />
                            Imagination
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src={"https://cdn.darkintaqt.com/lol/static/challenges/veterancy.webp"} alt="" />
                            Veterancy
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src={"https://cdn.darkintaqt.com/lol/static/challenges/collection.webp"} alt="" />
                            Collection
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src={"https://cdn.darkintaqt.com/lol/static/challenges/expertise.webp"} alt="" />
                            Expertise
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src={"https://cdn.darkintaqt.com/lol/static/challenges/legacy.webp"} alt="" />
                            Legacy
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src={"https://cdn.darkintaqt.com/lol/static/challenges/2022seasonal.webp"} alt="" />
                            2022 Seasonal
                        </button>
                    </div>

                    <div className={challengeCSS.category} category="type">
                        <p className={challengeCSS.cheading}>Type</p>
                        <button onClick={this.changeFilter}>
                            <i className="fa-solid fa-angles-up"></i>
                            Progression
                        </button>
                        <button onClick={this.changeFilter}>
                            <i className="fa-solid fa-play"></i>
                            Ingame
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src="https://cdn.darkintaqt.com/lol/static/challenges/eternals.webp" alt="" />
                            Eternals
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src="https://cdn.darkintaqt.com/lol/static/challenges/clash.webp" alt="" />
                            Clash
                        </button>
                        <button onClick={this.changeFilter}>
                            <i className="fa-solid fa-box-open"></i>
                            Collect
                        </button>
                        <button onClick={this.changeFilter}>
                            <i className="fa-solid fa-ranking-star"></i>
                            Ranked
                        </button>
                        <button onClick={this.changeFilter}>
                            <i className="fa-solid fa-user"></i>
                            Profile
                        </button>
                    </div>

                    <div className={challengeCSS.category} category="gamemode">
                        <p className={challengeCSS.cheading}>Gamemode</p>
                        <button onClick={this.changeFilter}>
                            <img src={"https://lolcdn.darkintaqt.com/cdn/sr.svg"} alt="" />
                            Summoners Rift
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src={"https://lolcdn.darkintaqt.com/cdn/ha.svg"} alt="" />
                            ARAM
                        </button>
                        <button onClick={this.changeFilter}>
                            <img src={"https://lolcdn.darkintaqt.com/cdn/bot.png"} alt="" />
                            Bot
                        </button>
                    </div>
                </div>
            </div>
            <div className={css.parent}>
                {challengePoints}
                {this.state.challenges}
            </div>
        </div>
    }
}