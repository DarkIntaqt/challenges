import { Component } from "react";
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


const Title = Loadable({
    loader: (content) => import('./UserTitle'),
    loading: function () {
        return <div style={{ width: "100%", float: "left" }}>
            <Loader />
            <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Titles...</p>
        </div>
    },
});


export default class User extends Component {
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
            availableTitles: {}
        }



        this.user = props.params.user
        this.server = serverToMachineReadable(props.params.server)


        this.getChallengeURL = `https://cdn.darkintaqt.com/lol/static/challenges-${this.server}.json?t=${(new Date().getMonth() + 1).toString() + (new Date().getDate()).toString() + new Date().getFullYear().toString()}`
        this.getSummonerURL = `https://challenges.darkintaqt.com/api/v4/u/?name=${this.user}&server=${this.server}`


        const tryLoadChallenges = getCache(this.getChallengeURL)
        const tryLoadSummoner = getCache(this.getSummonerURL)

        let currentUserConfig = basicUserConfig

        if (tryLoadChallenges === true && tryLoadSummoner === true) {

            currentUserConfig = generateSummonerObject(tryLoadSummoner)

        }

        this.requestCache = [false, false]

        this.state = {
            error: false,
            user: currentUserConfig
        }

        this.addFileToCache = this.addFileToCache.bind(this)
        this.throwError = this.throwError.bind(this)
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


    render() {
        let error = this.state.error;

        const currentLocation = window.location.pathname.split("/")[3] ?? "overview"

        const allowedLocations = ["overview", "titles", "unnamed"]

        if (!allowedLocations.includes(currentLocation)) {

            error = true

        }

        if (error === true) {

            return <Error></Error>

        }


        const profileText = "view " + this.state.name + "'s profile on u.gg";

        const { tier, summonerIcon, summonerName, selections, titles } = this.state.user

        let selected = selections.map(function (selection) {

            const tier = intToTier(selection[1])
            const challenge = getChallenge(selection[0])

            const threshold = challenge.thresholds[tier]

            return <div key={selection[0]} style={{
                backgroundImage: `url(${config.cdnBasePath}/s/c-${selection[0].toString(16)}-${strtolower(tier)})`
            }}>
                <div className={tier}>
                    <b>
                        {capitalize(tier)} Token
                    </b>
                    <br />
                    {challenge.translation.description}
                    <br />
                    <br />
                    <i>Need {beautifyNum(threshold)}</i>
                </div>
            </div>
        })

        let title = titles.map(function (title) {

            const tier = intToTier(title[2])
            const challenge = getChallenge(title[0])
            const threshold = challenge.thresholds[tier]

            return <h2 key={title[0]} className={tier}>
                <span>{title[1]}</span>
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




        return <section className="object1000">

            {/* STATIC PROFILE HEAD */}
            <div className={`${css.profile} ${tier}`}>

                <img src={`${config.cdnBasePath}/cdn/profileicon/${summonerIcon}`} alt="" />

                <h1>
                    {summonerName}
                    {typeof summonerName === "object" ? null : <a href={"https://u.gg/lol/profile/" + this.server + "/" + decodeURI(strtolower(this.state.name)) + "/overview"} target="_blank" rel="noreferrer nofollow" className={css.uggarea}><img className={css.ugglogo} src="https://cdn.darkintaqt.com/lol/static/challenges/ugg.svg" alt={profileText} title={profileText}></img></a>}
                </h1>
                {title}
                <div className={css.selections}>
                    {selected}
                </div>

            </div>



            <div className={css.topLevelFilter + " " + css["selectedFilter" + currentLocation]}>

                <Link to="" className={css["overview"]}>Overview</Link>

                <Link to="titles" className={css["titles"]}>Titles</Link>

            </div>


            <Routes>

                <Route path="" element={<UserChallenges summoner={this.state.user} server={this.params.server} />}></Route>

                <Route path="titles" element={<Title summoner={this.state.user} />}></Route>

            </Routes>

        </section>
    }
}