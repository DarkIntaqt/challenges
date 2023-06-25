import { Component, Fragment } from "react";
import css from "../../css/user.module.css"
import config from "../../config"
import { capitalize, strtolower, strtoupper } from "../../func/stringManipulation"
import { intToTier } from "../../func/tierFunctions";
import getChallenge from "../../func/getChallenge"

import { Link, Route, Routes } from "react-router-dom";

import { serverToMachineReadable, serverToRegionString, serverToHumanReadable } from "../../func/server";

import { beautifyNum } from "../../func/beautify.js"
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
import { checkExists } from "../../func/arrayManipulationFunctions";


const Title = Loadable({
    loader: () => import('./UserTitle'),
    loading: function () {
        return <div style={{ width: "100%", float: "left" }}>
            <Loader />
            <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Titles...</p>
        </div>
    },
});


const Statistics = Loadable({
    loader: () => import('./UserStatistics'),
    loading: function () {
        return <div style={{ width: "100%", float: "left" }}>
            <Loader />
            <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Statistics...</p>
        </div>
    },
});


const History = Loadable({
    loader: () => import('./UserHistory'),
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
            percentile: 1,
            server: ""
        }



        this.user = props.params.user
        this.server = serverToMachineReadable(props.params.server)


        this.getChallengeURL = `https://challenges.darkintaqt.com/api/dynamic-data/serve?region=${this.server}&lang=${window.language}`
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

    componentDidUpdate() {
        if (this.props.params.user !== this.user) {

            const props = this.props;

            this.user = props.params.user
            this.server = serverToMachineReadable(props.params.server)
            this.requestCache = [false, false]
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
                percentile: 1,
                server: ""
            }


            this.getChallengeURL = `https://challenges.darkintaqt.com/api/dynamic-data/serve?region=${this.server}&lang=${window.language}`
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


            this.setState({
                error: false,
                user: currentUserConfig,
                verified: verified,
                translation: props.t
            });

            get(this.getChallengeURL, (e) => { this.addFileToCache(e, 0) }, this.throwError)
            get(this.getSummonerURL, (e) => { this.addFileToCache(e, 1) }, this.throwError)

        }
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

                    let skip = false;
                    for (let i = 0; i < parsedList.length; i++) {

                        if (parsedList[i][1] === summonerObject.summonerName && parsedList[i][0] === this.params.server) {
                            skip = true
                        }

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

        if (this.props.params.user !== this.user) {
            error = true;
        }

        if (error === true) {

            return <Error></Error>

        }

        const { tier, summonerIcon, summonerName, selections, titles, id, points, percentile, server } = this.state.user

        const profileText = "view " + summonerName + "'s profile on ";

        let displayTier = tier;
        if (displayTier === "NONE") {
            displayTier = "";
        }

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
            let tier, challenge, threshold, titlename, description;
            if (title === 1) {
                threshold = 0;
                tier = "IRON";
                titlename = "Apprentice"
                challenge = { translation: { description: "Default title" } }
            } else {
                let titleTier = title.toString().slice(-2)



                tier = intToTier(parseInt(titleTier))
                challenge = getChallenge(parseInt(title.toString().slice(0, -2)))

                if (!checkExists(challenge.thresholds) || !checkExists(challenge.title) || !checkExists(challenge.translation) || !checkExists(challenge.translation.description)) {
                    titlename = "Unknown Title";
                    description = "Id " + title;
                    threshold = 0;
                } else {
                    description = challenge.translation.description;
                    titlename = challenge.title;
                    threshold = challenge.thresholds[tier];
                }
            }
            return <Fragment key={title}>
                <span className={css.titlePlaceholder}> - </span>
                <h2 className={tier}>
                    <span>{titlename}</span>
                    <div>
                        <b>
                            {t("{{s}} Title", { s: capitalize(t(strtolower(tier))) })}
                        </b>
                        <br />
                        {description}
                        <br />
                        <br />
                        <i>{t("Need {{p}}", { p: beautifyNum(threshold) })}</i>
                    </div>
                </h2>
            </Fragment>
        })


        if (typeof summonerName !== "object" && this.state.verified === 0) {
            get("https://challenges.darkintaqt.com/api/v1/c-vip/?id=" + id, this.validateVerified)
        }

        return <Wrapper showAds={typeof summonerName !== "object"}>



            {/* STATIC PROFILE HEAD */}
            <div className={`${css.profile} ${tier}`} >

                <img className={css.edge} src={`https://cdn.darkintaqt.com/lol/static/challenges/card-${tier}.webp`} alt="" />

                <img src={`${config.cdnBasePath}/cdn/profileicon/${summonerIcon}`} alt="" />

                <h1>
                    {summonerName}{this.state.verified === true ? <a href="https://darkintaqt.com/blog/about-challenge-tracker#what-are-these-blue-checkmarks" target="_blank" rel="noreferrer" ><VipBadge size={"2rem"} /></a> : null}{typeof summonerName === "object" ? null : <Fragment>
                        <a href={"https://u.gg/lol/profile/" + this.server + "/" + decodeURI(strtolower(summonerName)) + "/overview"} target="_blank" rel="noreferrer nofollow" className={css.uggarea}><img className={css.ugglogo} src="https://cdn.darkintaqt.com/lol/static/challenges/ugg.svg" alt={profileText + "u.gg"} title={profileText + "u.gg"}></img></a>
                        <a href={"https://masterychart.com/profile/" + serverToHumanReadable(this.server).replace("oc", "oce") + "/" + decodeURI(strtolower(summonerName)) + "?utm_source=Challenge+Tracker&utm_medium=Website&utm_campaign=Profile"} target="_blank" rel="noreferrer nofollow" className={css.uggarea}><img className={css.mclogo} src="https://challenges.darkintaqt.com/api/masterychart-full.png" alt={profileText + "Masterychart"} title={profileText + "Masterychart"}></img></a>
                    </Fragment>
                    }
                </h1>

                <h2>
                    <span>
                        {capitalize(t(strtolower(displayTier)))}
                    </span>
                    <div>
                        <b>{capitalize(t(strtolower(displayTier)))} {t("Tier")}</b>
                        <br />
                        This player has {beautifyNum(points)} total points.
                        <br />
                        <br />
                        This player is in the top {Math.round(percentile * 100)}% in {serverToRegionString(server)}.
                    </div>
                </h2>

                {title}

                <div className={css.selections}>
                    {selected}
                </div>

            </div>



            <div className={css.topLevelFilter + " " + css["selectedFilter" + currentLocation]}>

                <Link to="" className={css["overview"]}>{t("Overview")}</Link>

                <Link to="titles" className={css["titles"]}>{t("Titles")}</Link>

                <Link to="statistics" className={css["statistics"]}>{t("Statistics")}</Link>

                <Link to="history" className={css["history"]}>{t("History")} <span>{strtoupper(t("new"))}</span></Link>

            </div>


            <Routes>

                <Route path="" element={<UserChallenges summoner={this.state.user} server={this.params.server} />}></Route>

                <Route path="titles" element={<Title summoner={this.state.user} />}></Route>

                <Route path="statistics" element={<Statistics summoner={this.state.user} />}></Route>

                <Route path="history" element={<History summoner={this.state.user} />}></Route>

            </Routes>

        </Wrapper>
    }
}
export default withTranslation()(User)
