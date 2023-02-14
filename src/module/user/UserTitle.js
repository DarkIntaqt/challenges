import { Component } from "react";
import ChallengeObject from "../ChallengeObject";
import getChallenge from "../../func/getChallenge";
import { intToTier } from "../../func/tierFunctions";

import ProgressBar from "../ProgressBar";

import css from "../../css/user.module.css"
import titleCSS from "../../css/userTitle.module.css"

import Loader from "../Loader";
import get from "../../func/get";
import orderChallenges from "./orderChallenges";
import { capitalize } from "../../func/stringManipulation";
import filterCSS from "../../css/filter.module.css"
import { withTranslation } from "react-i18next";


class UserTitle extends Component {
    constructor(props) {
        super(props)

        this.props = props

        this.state = {
            titles: {},
            message: "Loading Titles...",
            translation: props.t,
            filter: "alphabetic"
        }

        this.addTitle = this.addTitle.bind(this)
        this.error = this.error.bind(this)
        this.changeFilter = this.changeFilter.bind(this)
    }


    componentDidMount() {
        get("https://cdn.darkintaqt.com/lol/static/titles.json", this.addTitle, this.error)
    }

    addTitle(titles) {

        this.setState({ titles: titles.titles })

    }

    error() {

        this.setState({ message: "Error loading titles" })

    }

    changeFilter(e) {
        const user = JSON.parse(JSON.stringify(this.props.summoner));


        if (user.challenges.length !== 0 && Object.entries(this.state.titles).length !== 0) {

            const button = e.currentTarget
            const filter = this.state.filter

            document.getElementById(filter).classList.remove(filterCSS["selected"])

            if (filter === button.id) {
                return
            }

            button.classList.add(filterCSS["selected"])

            let tempFilter = button.id

            this.setState({ filter: tempFilter })
        }
    }


    render() {
        const t = this.state.translation;

        let user = JSON.parse(JSON.stringify(this.props.summoner));

        user.challenges = orderChallenges(user.challenges, "level", { gamemode: [], type: [], category: [] })

        if (user.challenges.length === 0 || Object.entries(this.state.titles).length === 0) {

            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>{this.state.message}</p>
            </div>

        }

        document.title = `${user.summonerName}'s Title Overview`

        let userTitles = ["1"]

        const titleList = this.state.titles
        let challengeIdList = Object.keys(titleList).map(function (id) {
            if (id === "1") {
                return "1"
            }
            return id.substring(0, id.length - 2)
        })

        let notUnlocked = []

        for (let i = 0; i < user.challenges.length; i++) {
            const challenge = user.challenges[i];
            if (challengeIdList.includes(challenge[6].id.toString())) {
                for (const key in titleList) {
                    if (Object.hasOwnProperty.call(titleList, key)) {
                        if (key === "1") {
                            continue
                        }
                        if (key.substring(0, key.length - 2) === challenge[6].id.toString()) {
                            if ((parseInt(key.substring(key.length - 2)) + 1) <= challenge[1]) {
                                userTitles.push(key)
                            }
                        }
                    }
                }
            }
        }

        let titleIdList = Object.keys(titleList)

        for (let i = 0; i < titleIdList.length; i++) {
            const title = titleIdList[i];
            if (!userTitles.includes(title)) {
                notUnlocked.push(title)
            }
        }

        const titles = userTitles.map(function (titleId) {
            return [
                titleId,
                titleList[titleId] ?? "Unknown"
            ]

        }).sort(function (a, b) { return a[1].localeCompare(b[1]) });

        const notUnlockedList = notUnlocked.map(function (titleId) {
            return [
                titleId,
                titleList[titleId] ?? "Unknown"
            ]

        }).sort(function (a, b) { return a[1].localeCompare(b[1]) });



        const displayTitles = titles.map(function (title) {
            const titleid = title[0]
            const content = title[1]

            if (titleid === "1") {
                return <ChallengeObject
                    tier="IRON"
                    href={"/titles"}
                    title={content}
                    subtitle={<span>Achieved by 100%</span>}
                    description={"This is a default title. Everyone owns it. Actually it is not even rare, as everyone has unlocked it, so please don't be proud of this one"}
                    key={titleid}
                    forceFullMode={true}
                />
            }
            const titleIdString = titleid.toString()

            let challenge = getChallenge(parseInt(titleIdString.substr(0, titleIdString.length - 2)))
            const tier = intToTier(parseInt(titleIdString.substring(titleIdString.length - 2)) + 1)


            try {
                let percentage
                try {
                    percentage = Math.round(challenge.percentiles[tier] * 1000) / 10
                } catch (error) {
                    percentage = "0"
                }
                return <ChallengeObject
                    tier={tier}
                    href={"/titles"}
                    title={content}
                    subtitle={"Achieved by " + percentage + "%"}
                    description={challenge.translation.description ?? "No description available. Is this title still available?"}
                    key={titleid}
                    nexttier="MAXED"
                    forceFullMode={true}
                />
            } catch (e) {
                console.error(e)
                return []
            }
        })

        const notUnlockedTitles = notUnlockedList.map(function (title) {
            const titleid = title[0]
            const content = title[1]
            const titleIdString = titleid.toString()

            let challenge = getChallenge(parseInt(titleIdString.substr(0, titleIdString.length - 2)))
            if (challenge === 0) {
                challenge = {
                    "translation": {
                        "description": "No description available. Is this title still available?"
                    },
                    "thresholds": {
                        "IRON": 999,
                        "BRONZE": 999,
                        "SILVER": 999,
                        "GOLD": 999,
                        "PLATINUM": 999,
                        "DIAMOND": 999,
                        "MASTER": 999,
                        "GRANDMASTER": 999,
                        "CHALLENGER": 999,
                    }
                }
            }


            const tier = intToTier(parseInt(titleIdString.substring(titleIdString.length - 2)) + 1)

            try {
                let percentage
                let userprogress = 0
                try {
                    percentage = Math.round(challenge.percentiles[tier] * 1000) / 10

                    for (let i = 0; i < user.challenges.length; i++) {
                        const element = user.challenges[i];
                        if (element[0] === parseInt(titleIdString.substr(0, titleIdString.length - 2))) {
                            userprogress = element[2]
                        }
                    }

                } catch (error) {
                    percentage = "0"
                }
                return <ChallengeObject
                    tier={"UNRANKED"}
                    href={"/titles"}
                    title={content}
                    subtitle={"Locked - reach " + capitalize(tier) + " tier"}
                    description={challenge.translation.description}
                    key={titleid}
                    nexttier="MAXED"
                    progressCurrent={userprogress}
                    progressNext={challenge["thresholds"][tier]}
                    forceFullMode={true}
                />
            } catch (e) {
                console.trace(title)
                console.error(e)
                return []
            }
        })


        return <div className={`${user.tier}`}>

            <div className={titleCSS.head}>
                <div className={titleCSS.progress}>

                    <ProgressBar
                        width={120}
                        max={Object.keys(this.state.titles).length}
                        progress={titles.length}
                        percentage={true}
                    />
                    <p>Titles unlocked</p>

                </div>
            </div>

            <section>
                <div className={filterCSS.filter}>
                    <div className={filterCSS.selectors + " clearfix"}>
                        <p className={filterCSS.info}>Filter</p>
                        <div className={filterCSS.category} category="category">
                            <p className={filterCSS.cheading}>{t("Order by")}</p>

                            <button onClick={this.changeFilter} id="alphabetic" className={filterCSS["selected"]}>
                                <i className={"fa-solid fa-arrow-down-a-z"}></i>
                                Alphabetic
                            </button>

                            <button onClick={this.changeFilter} id="rarity">
                                <i className="fa-solid fa-ranking-star"></i>
                                Rarity
                            </button>
                        </div>

                    </div>
                </div>
                <div className={css.parent + " " + css.flexWidth}>
                    {displayTitles}
                    {notUnlockedTitles}
                </div>
                <p style={{ color: "var(--light3)", fontSize: ".8rem", margin: "10px 0 30px", width: "100%", float: "left" }}>Note: The "Apprentice" title does not count towards the "Entitled" challenge. </p>
            </section>
        </div>
    }
}

export default withTranslation()(UserTitle)