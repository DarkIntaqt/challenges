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

export default class UserTitle extends Component {
    constructor(props) {
        super(props)

        this.props = props

        this.state = {
            titles: {},
            message: "Loading Titles..."
        }

        this.addTitle = this.addTitle.bind(this)
        this.error = this.error.bind(this)
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

    render() {

        let user = JSON.parse(JSON.stringify(this.props.summoner));
        user.challenges = orderChallenges(user.challenges, "level", { gamemode: [], type: [], category: [] })

        if (user.challenges.length === 0 || Object.entries(this.state.titles).length === 0) {

            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>{this.state.message}</p>
            </div>

        }

        document.title = `${user.summonerName}'s Title Overview`

        let userTitles = [1]

        const titleList = this.state.titles
        let challengeIdList = Object.keys(titleList).map(function (id) {
            if (id === "1") {
                return "1"
            }
            return id.substring(0, id.length - 2)
        })

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

        const titles = userTitles.map(function (titleId) {
            return [
                titleId,
                titleList[titleId] ?? "Unknown"
            ]

        }).sort(function (a, b) { return a[1].localeCompare(b[1]) });



        const displayTitles = titles.map(function (title) {
            const titleid = title[0]
            const content = title[1]

            if (titleid === 1) {
                return <ChallengeObject
                    tier="NONE"
                    href={"/titles"}
                    title={content}
                    subtitle={<span>Achieved by 100%</span>}
                    description={"This is a default title. Everyone owns it. Actually it is not even rare, as everyone has unlocked it, so please don't be proud of this one"}
                    key={titleid}
                    forceFullMode={true}
                />
            }
            const titleIdString = titleid.toString()

            const challenge = getChallenge(parseInt(titleIdString.substr(0, titleIdString.length - 2)))
            const tier = intToTier(parseInt(titleIdString.substring(titleIdString.length - 2)))

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
                    description={challenge.translation.description}
                    key={titleid}
                    nexttier="MAXED"
                    forceFullMode={true}
                />
            } catch (e) {
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

            <div className={css.parent}>
                {displayTitles}
            </div >
            <p style={{ color: "var(--light3)", fontSize: ".8rem", margin: "10px 0 30px", width: "100%", float: "left" }}>Note: The "Apprentice" title does not count towards the "Entitled" challenge. </p>

        </div>
    }
}