import { Component, Fragment } from "react";
import css from "../../css/user.module.css"
import config from "../../config"
import { capitalize, strtolower } from "../../func/stringManipulation"
import { intToTier } from "../../func/tierFunctions";
import getChallenge from "../../func/getChallenge"

import { Link, Route, Routes } from "react-router-dom";

import { serverToMachineReadable } from "../../func/server";

import { beautifyNum } from "../../func/beautify.ts"
import { getCache } from "../../func/getCheckCache";
import generateSummonerObject from "./generateSummonerObject";
import get from "../../func/get";
import Error from "../Error";

import Loader from "../Loader";

import Loadable from "react-loadable";

import UserChallenges from "./UserChallenges"
import VipBadge from "../VipBadge";
import Wrapper from "../Wrapper";
import { withTranslation } from "react-i18next";
import { t } from "i18next";


const Title = Loadable({
    loader: (content) => import('./UserTitle'),
    loading: function () {
        return <div style={{ width: "100%", float: "left" }}>
            <Loader />
            <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Titles...</p>
        </div>
    },
});


const Statistics = Loadable({
    loader: (content) => import('./UserStatistics'),
    loading: function () {
        return <div style={{ width: "100%", float: "left" }}>
            <Loader />
            <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Statistics...</p>
        </div>
    },
});


const History = Loadable({
    loader: (content) => import('./UserHistory'),
    loading: function () {
        return <div style={{ width: "100%", float: "left" }}>
            <Loader />
            <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>0%</p>
            <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Matches...</p>
        </div>
    },
});


class User extends Component {
    constructor(props) {
        super(props)

        this.params = props.params


        const basicUserConfig = {
            tier: config.tiers[0],
            summonerIcon: -1,
            summonerName: <div className={css.loadinganimation} style={{
                width: props.params.user.length * 1.4 + "rem",
                height: "2rem", borderRadius: "5px"
            }}></div>,
            selections: [],
            titles: [],
            challenges: [],
            availableTitles: {},
            categories: {},
            points: [0, 0, 0],
            id: "",
            region: ""
        }



        this.user = props.params.user
        this.server = serverToMachineReadable(props.params.server)


        this.getChallengeURL = `https://challenges.darkintaqt.com/api/dynamic-data/${this.server}`
        this.getSummonerURL = `https://challenges.darkintaqt.com/api/edge/user/${this.server}/${encodeURIComponent(this.user)}`


        const tryLoadChallenges = getCache(this.getChallengeURL)
        const tryLoadSummoner = getCache(this.getSummonerURL)

        let currentUserConfig = basicUserConfig

        if (tryLoadChallenges !== false && tryLoadSummoner !== false) {
            currentUserConfig = generateSummonerObject(tryLoadSummoner)
            window.JSONPREQUEST = tryLoadChallenges
        }

        const verifiedCache = getCache("https://challenges.darkintaqt.com/api/v1/c-vip/?id=" + currentUserConfig.id)
        let verified = 0
        if (verifiedCache !== false) {
            verified = verifiedCache[0]
        }


        this.requestCache = [false, false]

        this.state = {
            error: false,
            user: currentUserConfig,
            verified: verified,
            translation: props.t
        }

        this.addFileToCache = this.addFileToCache.bind(this)
        this.throwError = this.throwError.bind(this)
        this.validateVerified = this.validateVerified.bind(this)
    }

    throwError() {
        this.setState({ error: true })
    }



    addFileToCache(content, id) {
        this.requestCache[id] = content

        if (this.requestCache[0] !== false && this.requestCache[1] !== false) {

            window.JSONPREQUEST = this.requestCache[0]
            const summonerObject = generateSummonerObject(this.requestCache[1])

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

                        if (parsedList[i][1] === summonerObject.summonerName && parsedList[i][0] === this.params.server) { skip = true }

                    }

                    if (skip === false) {
                        parsedList.splice(0, 0, [this.params.server, summonerObject.summonerName, Math.round(summonerObject.summonerIcon)])

                        if (parsedList.length > 5) {

                            parsedList = parsedList.slice(0, 5)

                        }

                        localStorage.setItem("_search", JSON.stringify(parsedList))

                    }
                }
            } else {

                localStorage.setItem("_search", JSON.stringify([[this.params.server, summonerObject.summonerName, Math.round(summonerObject.summonerIcon)]]))

            }

            this.setState({ user: summonerObject })

        }
    }

    componentDidMount() {

        document.title = 'Loading ' + this.user + "'s profile"

        get(this.getChallengeURL, (e) => { this.addFileToCache(e, 0) }, this.throwError)
        get(this.getSummonerURL, (e) => { this.addFileToCache(e, 1) }, this.throwError)

    }

    validateVerified(e) {
        if (e[0] === true) {
            this.setState({ verified: true })
            return
        }
        this.setState({ verified: false })
    }


    render() {
        const t = this.state.translation
        let error = this.state.error;

        const currentLocation = window.location.pathname.split("/")[3] ?? "overview"

        const allowedLocations = ["overview", "titles", "statistics", "history"]

        if (!allowedLocations.includes(currentLocation)) {

            error = true

        }

        if (document.location.pathname.slice(-1) === "/") {
            error = true
        }

        if (window.location.pathname.split("/").length > 4) {
            error = true
        }


        if (error === true) {

            return <Error></Error>

        }

        const { tier, summonerIcon, summonerName, selections, titles, id } = this.state.user

        const profileText = "view " + summonerName + "'s profile on u.gg";


        let selected = selections.map(function (selection) {

            const tier = intToTier(selection[1])
            const challenge = getChallenge(selection[0])

            const threshold = challenge.thresholds[tier]

            return <div key={selection[0]} style={{
                backgroundImage: `url(${config.cdnBasePath}/cdn/np-token/${selection[0]}/${strtolower(tier)})`
            }}>
                <div className={tier}>
                    <b>
                        {t("{{token}} Token", { token: capitalize(tier) })}
                    </b>
                    <br />
                    {challenge.translation.description}
                    <br />
                    <br />
                    <i>{t("Need {{p}}", { p: beautifyNum(threshold) })}</i>
                </div>
            </div>
        })

        let title = titles.map(function (title) {
            let tier, challenge, threshold, titlename;
            if (title === 1) {
                threshold = 0;
                tier = "IRON";
                titlename = "Apprentice"
                challenge = { translation: { description: "Default title" } }
            } else {
                let titleTier = title.toString().slice(-2)



                tier = intToTier(parseInt(titleTier))
                challenge = getChallenge(parseInt(title.toString().slice(0, -2)))
                titlename = challenge.title ?? "Unknown Title"

                threshold = challenge.thresholds[tier]
            }
            return <h2 key={title} className={tier}>
                <span>{titlename}</span>
                <div>
                    <b>
                        {capitalize(tier)} Title
                    </b>
                    <br />
                    {challenge.translation.description}
                    <br />
                    <br />
                    <i>Need {beautifyNum(threshold)}</i>
                </div>
            </h2>
        })


        if (typeof summonerName !== "object" && this.state.verified === 0) {
            get("https://challenges.darkintaqt.com/api/v1/c-vip/?id=" + id, this.validateVerified)
        }

        return <div className={css.userwrapperfull}>
            {this.state.verified === true ? <div className={css.wrapperbg} style={{
                backgroundImage: `url(https://cdn.darkintaqt.com/lol/static/challenges/_${strtolower(tier)}-full.webp)`
            }}></div> : null}
            <section className={css.innerwrapper}>
                <Wrapper showAds={typeof summonerName !== "object"}>



                    {/* STATIC PROFILE HEAD */}
                    <div className={`${css.profile} ${tier}`} >

                        <img className={css.edge} src={`https://cdn.darkintaqt.com/lol/static/challenges/card-${tier}.webp`} alt="" />

                        <img src={`${config.cdnBasePath}/cdn/profileicon/${summonerIcon}`} alt="" />

                        <h1>
                            {summonerName}{this.state.verified === true ? <VipBadge size={"2rem"} /> : null}{typeof summonerName === "object" ? null : <Fragment>
                                <a href={"https://u.gg/lol/profile/" + this.server + "/" + decodeURI(strtolower(summonerName)) + "/overview"} target="_blank" rel="noreferrer nofollow" className={css.uggarea}><img className={css.ugglogo} src="https://cdn.darkintaqt.com/lol/static/challenges/ugg.svg" alt={profileText} title={profileText}></img></a>
                            </Fragment>
                            }
                        </h1>

                        {title}

                        <div className={css.selections}>
                            {selected}
                        </div>

                    </div>



                    <div className={css.topLevelFilter + " " + css["selectedFilter" + currentLocation]}>

                        <Link to="" className={css["overview"]}>{t("Overview")}</Link>

                        <Link to="titles" className={css["titles"]}>{t("Titles")}</Link>

                        <Link to="statistics" className={css["statistics"]}>{t("Statistics")}</Link>

                        {this.state.verified === true || currentLocation === "history" ? <Link to="history" className={css["history"]}>{t("History")} <span>{t("BETA")}</span></Link> : null}

                    </div>


                    <Routes>

                        <Route path="" element={<UserChallenges summoner={this.state.user} server={this.params.server} />}></Route>

                        <Route path="titles" element={<Title summoner={this.state.user} />}></Route>

                        <Route path="statistics" element={<Statistics summoner={this.state.user} />}></Route>

                        <Route path="history" element={<History summoner={this.state.user} />}></Route>

                    </Routes>

                </Wrapper>
            </section>
        </div>
    }
}
export default withTranslation()(User)