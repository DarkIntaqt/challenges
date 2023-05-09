import { Component } from "react"
import get from "../func/get"
import { serverToMachineReadable } from "../func/server"
import css from "../css/user.module.css"
import challengeCSS from "../css/challenges.module.css"
import getChallenge from "../func/getChallenge"
//import generateChallengePointElement from "../func/generateChallengePointElement"
import { checkExists } from "../func/arrayManipulationFunctions.js"
import config from "../config"
import ChallengeObject from "./ChallengeObject"

import { Fragment } from "react"
import filterCSS from "../css/filter.module.css"

import Wrapper from "./Wrapper"

import Loadable from "react-loadable";
import { setCookie } from "../func/cookiefunctions"
import Error from "./Error"
import { withTranslation } from "react-i18next"
import { capitalize } from "../func/stringManipulation"
import { storageKeys, getStorage, setStorage } from "../func/localStorageFunctions"

class Challenges extends Component {
    constructor(props) {
        super(props);
        this.load = this.load.bind(this)
        this.toLoad = { "content": [], "leaderboards": [] };
        this.loadChallenges = this.loadChallenges.bind(this)
        this.changeFilter = this.changeFilter.bind(this)
        this.applyFilters = this.applyFilterStyles.bind(this)
        this.showChallenges = this.showChallenges.bind(this)
        this.filter = getStorage(storageKeys.challengeFilters, { "category": [], "type": [], "gamemode": [] })
        this.searchFor = getStorage(storageKeys.challengeSearch, "");

        const LoadEvent = Loadable({
            loader: (content) => import('./events/Event.js'),
            loading: function () {
                return <div className={challengeCSS.crystal + " NONE"}></div>
            },
        });

        this.search = this.search.bind(this)

        this.changeDisplayMethod = this.changeDisplayMethod.bind(this)

        this.state = {
            challenges: window.loadingUI,
            event: <LoadEvent content="" />,
            translation: props.t
        }
    }

    load() {
        let server = serverToMachineReadable(window.region)
        this.server = server;


        get(`https://challenges.darkintaqt.com/api/dynamic-data/serve?region=euw1&lang=${window.language}`, this.loadChallenges)

    }

    loadChallenges(content) {

        this.showChallenges(content)

    }

    changeDisplayMethod(e) {
        if (e.currentTarget.id === "full" && window.compactMode === true) {
            window.compactMode = false
            this.showChallenges(window.JSONPREQUEST)
            setCookie("filter", "false");
        }
        if (e.currentTarget.id === "compact" && window.compactMode === false) {
            window.compactMode = true
            this.showChallenges(window.JSONPREQUEST)
            setCookie("filter", "true");
        }
    }

    showChallenges(challengeData) {
        window.JSONPREQUEST = challengeData

        let challenges = challengeData;

        challenges.sort(function (a, b) {
            return a["translation"]["name"] < b["translation"]["name"] ? -1 : +(a["translation"]["name"] > b["translation"]["name"])
        })

        let challengeObject = [];

        console.log(this.filter);
        for (let i = 0; i < challenges.length; i++) {
            const challenge = challenges[i];
            if (challenge.id < 10) {
                if (challenge.id !== 0) {
                    continue
                }
            }
            let highestTier = "NONE",
                queueIds = [],
                parentId = 0,
                obtainable = [];

            let ranks = config.tiers

            for (let i2 = 1; i2 < ranks.length; i2++) {
                const rank = ranks[i2];
                if (checkExists(challenge.thresholds[rank])) {
                    highestTier = ranks[i2]
                }
            }

            try {
                if (checkExists(challenge.tags["parent"])) {
                    let c = 0;
                    let parentChallengeId = parseInt(challenge.tags["parent"])
                    while (c < 10) {
                        let currentChallenge = getChallenge(parentChallengeId)
                        if (checkExists(currentChallenge["tags"]["parent"]) && currentChallenge.id > 10) {
                            parentChallengeId = parseInt(getChallenge(parentChallengeId)["tags"]["parent"])
                        } else {
                            c = 10;
                        }
                    }
                    parentId = getChallenge(parentChallengeId).id
                } else if ([600006, 600010, 600011, 600012, 0].includes(challenge.id)) {
                    parentId = 600006
                } else if (checkExists(challenge.tags["isCapstone"])) {
                    parentId = challenge.id
                } else {
                    parentId = 0
                }
                if (challenge.tags["source"] === "CHALLENGES") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("progress")) {
                        continue
                    }
                    obtainable.push(<div key={challenge.tags["source"] + i}>
                        <p>Obtainable by progressing challenges</p>
                        <i className="fa-solid fa-angles-up"></i>
                    </div>)
                }
                if (challenge.tags["source"] === "EOGD") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("ingame")) {
                        continue
                    }
                    // obtainable.push(<div key={challenge.tags["source"] + i}>
                    //     <p>Obtainable by playing games</p>
                    //     <i className="fa-solid fa-play"></i>
                    // </div>)
                }
                if (challenge.tags["source"] === "CAP_INVENTORY") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("inventory")) {
                        continue
                    }
                    obtainable.push(<div key={challenge.tags["source"] + i}>
                        <p>Obtainable by collecting items</p>
                        <i className="fa-solid fa-box-open"></i>
                    </div>)
                }
                if (challenge.tags["source"] === "CLASH") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("clash")) {
                        continue
                    }
                    obtainable.push(<div key={challenge.tags["source"] + i}>
                        <p>Obtainable by playing clash</p>
                        <img src="https://cdn.darkintaqt.com/lol/static/challenges/clash.webp" alt="Clash" />
                    </div>)
                }
                if (challenge.tags["source"] === "SUMMONER") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("profile")) {
                        continue
                    }
                    obtainable.push(<div key={challenge.tags["source"] + i}>
                        <p>Obtainable by leveling up your profile</p>
                        <i className="fa-solid fa-user"></i>
                    </div>)
                }
                if (challenge.tags["source"] === "ETERNALS") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("eternals")) {
                        continue
                    }
                    obtainable.push(<div key={challenge.tags["source"] + i}>
                        <p>Obtainable by progressing eternals</p>
                        <img src="https://cdn.darkintaqt.com/lol/static/challenges/eternals.webp" alt="Eternals" />
                    </div>)
                }
                if (challenge.tags["source"] === "RANKED") {
                    if (this.filter.type.length > 0 && !this.filter.type.includes("ranked")) {
                        continue
                    }
                    // obtainable.push(<div key={challenge.tags["source"] + i}>
                    //     <p>Obtainable by playing ranked</p>
                    //     <i className="fa-solid fa-ranking-star"></i>
                    // </div>)
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
                    queueIds.push(<div key={"all " + i}>
                        <p>All modes</p>
                        <img key={0} src="https://cdn.darkintaqt.com/lol/static/lanes/FILL.png" alt="All modes" />
                    </div>)
                } else if (enabled["isAram"] && !enabled["isSR"]) {
                    if (this.filter.gamemode.length > 0 && !this.filter.gamemode.includes("aram")) {
                        continue
                    }
                    queueIds.push(<div key={"aram " + i}>
                        <p>ARAM games only</p>
                        <img key={1} src={config.images.aram} alt="Aram games only" />
                    </div>)
                } else if (!enabled["isAram"] && enabled["isSR"]) {
                    if (this.filter.gamemode.length > 0 && !this.filter.gamemode.includes("summonersrift")) {
                        continue
                    }
                    queueIds.push(<div key={"sr " + i}>
                        <p>Summoners Rift only</p>
                        <img key={2} src={config.images.summonersrift} alt="Summoners Rift games only" />
                    </div>)
                } else {
                    if (this.filter.gamemode.length > 0 && !this.filter.gamemode.includes("bot")) {
                        continue
                    }
                    queueIds.push(<div key={"bot " + i}>
                        <p>Bot games only</p>
                        <img key={3} src={config.images.bot} alt="Bot games only" />
                    </div>)
                }
            } else if (this.filter.gamemode.length > 0) {
                continue
            }

            let parentName = getChallenge(parentId).translation.name;

            // Skip to next element if filter is on and not on element
            if (this.filter.category.length > 0 && !this.filter.category.includes(parentId.toString())) {
                if (this.filter.category.includes("seasonal-retired")) {
                    if (parentId !== 2022000) {
                        continue;
                    }
                } else {
                    continue;
                }
            }

            // getChallenge(parseInt(challenge.parentCategory))

            if (this.searchFor !== "" && (challenge.translation.name.toLowerCase().search(this.searchFor.toLowerCase()) === -1 && challenge.translation.description.toLowerCase().search(this.searchFor.toLowerCase()) === -1)) {
                continue
            }

            challengeObject.push(<ChallengeObject
                key={challenge.id}
                href={"/challenge/" + challenge.id}
                tier={highestTier}
                nexttier={["CROWN", "overview"]}
                title={challenge.translation.name}
                subtitle={parentName.toLowerCase()}
                description={challenge.translation.description}
                queueIds={<Fragment>
                    <div>
                        <p>{parentName.charAt(0).toUpperCase() + parentName.slice(1).toLowerCase()} Category</p>
                        <img src={config.images[parentId]} alt={parentName.toLowerCase()} />
                    </div>
                    {queueIds}
                    {obtainable}
                </Fragment>}
            />)
        }

        document.title = "All League of Legends Challenges Overview"


        this.setState({
            challenges: challengeObject,
        })
    }

    componentDidMount() {
        document.title = "Loading..."
        this.applyFilterStyles();
        this.load()
    }

    applyFilterStyles() {
        const buttons = document.querySelectorAll('button[data-id]');
        const filters = this.filter;
        if (filters == null) return;

        const dataFilters = [...filters.category, ...filters.type, ...filters.gamemode];

        for (const button of buttons) {
            const dataId = button.getAttribute("data-id");
            // Apply selected CSS if data id is found in saved filters.
            if (dataFilters.includes(dataId)) button.classList.add(filterCSS["selected"]);
        }
    }

    changeFilter(e) {
        let button = e.currentTarget;
        let c = button.getAttribute("data-id")

        let category = this.filter[button.parentNode.getAttribute("category")];
        if (button.classList.length > 0) {
            button.classList.remove(filterCSS["selected"])
            category = category.filter(x => x !== c);
        } else {
            button.classList.add(filterCSS["selected"])
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
        setStorage(storageKeys.challengeFilters, this.filter);
        this.showChallenges(window.JSONPREQUEST)
    }

    search(e) {
        const value = e.target.value;
        this.searchFor = value;
        setStorage(storageKeys.challengeSearch, value)
        this.showChallenges(window.JSONPREQUEST)
    }

    render() {
        const t = this.state.translation

        if (document.location.pathname.slice(-1) === "/") {
            return <Error></Error>
        }

        return <Wrapper >

            <div className={challengeCSS.heading}>
                <h1>{t("List of all Challenges")}</h1>
                <h2>{t("Overview and how to obtain them")}</h2>
            </div>

            <section className={css.parent}>
                {this.state.event}
            </section>

            <input type="text" placeholder={t("Search for a challenge")} onKeyUp={this.search} className={filterCSS.input} defaultValue={this.searchFor} />
            <div className={filterCSS.filter}>

                <div className={filterCSS.selectors + " clearfix"}>
                    <div className={filterCSS.displayMode}>
                        <button id="compact" onClick={this.changeDisplayMethod} className={filterCSS["cmode" + window.compactMode] + " " + filterCSS.modetrue}>
                            <i className="fa-solid fa-list"></i>
                        </button>
                        <button id="full" onClick={this.changeDisplayMethod} className={filterCSS["cmode" + window.compactMode] + " " + filterCSS.modefalse}>
                            <i className="fa-solid fa-table-cells"></i>
                        </button>
                    </div>
                    <p className={filterCSS.info}>Filter (multiple choices)</p>
                    <div className={filterCSS.category} category="category">
                        <p className={filterCSS.cheading}>{t("Category")}</p>
                        <button onClick={this.changeFilter} data-id="4">
                            <img src={config.images["4"]} alt="teamwork" />
                            {capitalize(getChallenge(4).translation.name)}
                        </button>
                        <button onClick={this.changeFilter} data-id="1">
                            <img src={config.images["1"]} alt="imagination" />
                            {capitalize(getChallenge(1).translation.name)}
                        </button>
                        <button onClick={this.changeFilter} data-id="3">
                            <img src={config.images["3"]} alt="veterancy" />
                            {capitalize(getChallenge(3).translation.name)}
                        </button>
                        <button onClick={this.changeFilter} data-id="5">
                            <img src={config.images["5"]} alt="collection" />
                            {capitalize(getChallenge(5).translation.name)}
                        </button>
                        <button onClick={this.changeFilter} data-id="2">
                            <img src={config.images["2"]} alt="expertise" />
                            {capitalize(getChallenge(2).translation.name)}
                        </button>
                        <button onClick={this.changeFilter} data-id="600006">
                            <img src={config.images["600006"]} alt="legacy" />
                            Legacy
                        </button>
                        <button onClick={this.changeFilter} data-id="2023000">
                            <img src={config.images['2023000']} alt="2023 seasonal" />
                            2023 Seasonal <span>{t("new").toUpperCase()}</span>
                        </button>
                        <button onClick={this.changeFilter} data-id="seasonal-retired">
                            <img src={config.images['seasonal-retired']} alt="seasonal outdated" />
                            Retired Seasonal
                        </button>
                    </div>

                    <div className={filterCSS.category} category="type">
                        <p className={filterCSS.cheading}>{t("Type")}</p>
                        <button onClick={this.changeFilter} data-id="progress">
                            <i className="fa-solid fa-angles-up"></i>
                            Progress
                        </button>
                        <button onClick={this.changeFilter} data-id="ingame">
                            <i className="fa-solid fa-play"></i>
                            Ingame
                        </button>
                        <button onClick={this.changeFilter} data-id="eternals">
                            <img src="https://cdn.darkintaqt.com/lol/static/challenges/eternals.webp" alt="eternals" />
                            Eternals
                        </button>
                        <button onClick={this.changeFilter} data-id="clash">
                            <img src="https://cdn.darkintaqt.com/lol/static/challenges/clash.webp" alt="clash" />
                            Clash
                        </button>
                        <button onClick={this.changeFilter} data-id="inventory">
                            <i className="fa-solid fa-box-open"></i>
                            Inventory
                        </button>
                        <button onClick={this.changeFilter} data-id="ranked">
                            <i className="fa-solid fa-ranking-star"></i>
                            Ranked
                        </button>
                        <button onClick={this.changeFilter} data-id="profile">
                            <i className="fa-solid fa-user"></i>
                            Profile
                        </button>
                    </div>

                    <div className={filterCSS.category} category="gamemode">
                        <p className={filterCSS.cheading}>{t("Gamemode")}</p>
                        <button onClick={this.changeFilter} data-id="summonersrift">
                            <img src={config.images.summonersrift} alt="Summoners Rift" />
                            Summoners Rift
                        </button>
                        <button onClick={this.changeFilter} data-id="aram">
                            <img src={config.images.aram} alt="ARAM" />
                            ARAM
                        </button>
                        <button onClick={this.changeFilter} data-id="bot">
                            <img src={config.images.bot} alt="Bot Games" />
                            Bot
                        </button>
                    </div>
                </div>
            </div>
            <div className={css.parent + " " + css.flexWidth}>
                {
                    this.state.challenges.length > 0
                        ? this.state.challenges
                        : <p style={{ color: "white", fontSize: "1rem", margin: "120px 0", textAlign: "center", width: "100%", float: "left" }}><i>Is it a bug? Is it a feature?</i><br /><br />No! There are just no challenges within the current filters.<br />Maybe the challenges aren't released yet?</p>
                }

            </div>
        </Wrapper>
    }
}

export default withTranslation()(Challenges)