import { Component, Fragment } from "react";
import config from "../../config";
import filterCSS from "../../css/filter.module.css"

import { toggleValue } from "../../func/arrayManipulationFunctions.ts"

import ChallengeObject from "../ChallengeObject";
import challengeCSS from "../../css/challengeObject.module.css"

import { beautifyNum } from "../../func/beautify.ts"
import { checkExists } from "../../func/arrayManipulationFunctions.ts"

import { intToTier } from "../../func/tierFunctions";

import Timestamp from "react-timestamps"

import css from "../../css/user.module.css"

import orderChallenges, { getNextLevel } from "./orderChallenges";
import goTo from "../../func/goTo";
import Loader from "../Loader"

export default class UserChallenges extends Component {
    constructor(props) {
        super(props)


        this.changeFilter = this.changeFilter.bind(this)
        this.changeExtraFilter = this.changeExtraFilter.bind(this)

        this.props = props

        this.state = {
            alphabet: "a-z",
            filter: "level",
            filters: {
                "category": [],
                "type": [],
                "gamemode": []
            }
        }

    }

    changeFilter(e) {
        const user = this.props.summoner

        if (user.challenges.length !== 0) {

            const button = e.currentTarget
            const filter = this.state.filter

            if (filter === button.id) {
                return
            }

            if (filter === "alphabetic-a-z") {
                document.getElementById("alphabetic-z-a").classList.remove(filterCSS["selected"])
            } else if (filter === "alphabetic-z-a") {
                document.getElementById("alphabetic-a-z").classList.remove(filterCSS["selected"])
            } else {
                document.getElementById(filter).classList.remove(filterCSS["selected"])
            }

            button.classList.add(filterCSS["selected"])

            let tempFilter = button.id
            let alphabetVar = this.state.alphabet

            if (tempFilter === "alphabetic-a-z" && alphabetVar === "a-z") {
                alphabetVar = "z-a"
            }

            if (tempFilter === "alphabetic-z-a" && alphabetVar === "z-a") {
                alphabetVar = "a-z"

            }

            this.setState({ filter: tempFilter, alphabet: alphabetVar })

        }
    }


    changeExtraFilter(e) {



        const user = this.props.summoner
        if (user.challenges.length !== 0) {

            let filters = this.state.filters

            const toggle = toggleValue(filters[e.currentTarget.getAttribute("type")], e.currentTarget.id)

            if (toggle.method === true) {

                e.currentTarget.classList.add(filterCSS["selected"])

            } else {

                e.currentTarget.classList.remove(filterCSS["selected"])

            }

            this.setState({ filters: filters })

        }
    }


    render() {

        const user = JSON.parse(JSON.stringify(this.props.summoner));

        if (user.challenges.length === 0) {

            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Challenges...</p>
            </div>

        }

        document.title = `${user.summonerName}'s Challenge Progress Overview`

        const server = this.props.server

        const filter = this.state.filter


        let challengesOrdered = orderChallenges(user.challenges, this.state.filter, this.state.filters)


        const challenges = challengesOrdered.map(function (challenge) {

            if (challenge[0] !== 0 && challenge[0] < 10) {
                return null
            }

            const tier = intToTier(challenge[1])

            let leaderboardposition = ""
            let position, next, previousPositions = 1;
            let nexttier = getNextLevel(tier)

            const c = challenge[6]


            if (c.leaderboard === true && challenge[5].length > 1) {
                switch (tier) {
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
                position = "#" + beautifyNum((previousPositions - 1) + challenge[5][1], false);

                if (challenge[5][1] <= 100 && challenge[5].length === 4) {

                    position = position + " (#" + challenge[5][3] + " World)";
                }
                position += " - ";

            }

            if (checkExists(c["thresholds"][nexttier])) {
                next = c["thresholds"][nexttier]
            } else {
                next = c["thresholds"][tier]
            }

            if (tier === "CHALLENGER") {
                if (c.leaderboard === true) {
                    // leaderboards, not #1
                    next = c["leaderboardThresholds"][0] ?? 0
                    nexttier = "CROWN";
                } else {
                    // No leaderboards, so maxed
                    nexttier = "MAXED"
                }
                if ((previousPositions - 1) + challenge[5][1] === 1) {
                    // leaderboards, #1
                    nexttier = "FIRST";
                }
            }

            let tags = []

            if (checkExists(challenge[8])) {
                tags.push(<img key={1} className={challenge[8]} src={config.images[challenge[8]]} alt="" />)
            }

            if (checkExists(challenge[7]) && challenge[7] !== "none") {
                tags.push(<img key={0} src={config.images[challenge[7]]} alt="" />)
            }




            if (filter === "timestamp") {
                leaderboardposition = <span><span className={challengeCSS.hideOnHover}><Timestamp date={challenge[3]} /></span><span className={challengeCSS.showOnHover}><Timestamp date={challenge[3]} type="static" /></span></span>
            } else {
                leaderboardposition = <span>{position}Top {(Math.round(challenge[5][0] * 10000) / 100)}%</span>
            }


            return <ChallengeObject
                tier={tier}
                nexttier={nexttier}
                title={c.translation.name}
                subtitle={leaderboardposition}
                description={c.translation.description}
                href={"/challenge/" + challenge[0] + "?region=" + server}
                queueIds={tags}
                progressCurrent={challenge[2]}
                progressNext={next}
                key={challenge[0]}
            ></ChallengeObject>
        })?.filter(x => x !== null)

        if (user.challenges.length === 0) {

            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
            </div>

        }

        return <Fragment>

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
                <p className={css.legal}>
                    <span data-nosnippet>
                        The U.GG logo belongs to U.GG. Read more <a href="/faq#h4" onClick={goTo}>here</a>.
                        <br /><br />Click <a href="/faq" onClick={goTo}>here</a> to get any questions aobut this page answered.
                    </span>
                </p>
            </div>


            <div className={css.parent + " " + css.flexWidth} style={this.state.extraStyleNormal}>
                {challenges}
            </div>

        </Fragment>
    }
}