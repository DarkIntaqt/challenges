import { Component, Fragment } from "react";
import css from "../../css/match.module.css"
import get from "../../func/get";
import Loader from "../Loader";
import { checkExists } from "./../../func/arrayManipulationFunctions.ts";
import Timestamp from "react-timestamps"
import { intToTier } from "./../../func/tierFunctions"
import { beautifyNum } from "../../func/beautify.ts";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ChallengeObject from "./../ChallengeObject"
import getChallenge from "../../func/getChallenge"

const secondsToMMSS = (seconds) => {
    const MM = `${Math.floor(seconds / 60) % 60}`.padStart(2, '0');
    const SS = `${Math.floor(seconds % 60)}`.padStart(2, '0');
    return [MM, SS].join(':')
}


function inViewport(element) {
    if (!element) return false;
    if (1 !== element.nodeType) return false;

    var html = document.documentElement;
    var rect = element.getBoundingClientRect();

    return !!rect &&
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.left <= html.clientWidth &&
        rect.top <= html.clientHeight;
}


function getQueue(queueId) {
    let queues = window.queues;
    for (let i = 0; i < queues.length; i++) {
        if (queues[i]["queueId"] === queueId) {
            return queues[i]["description"]
        }
    }
    return "Unkown Gamemode"
}

export default class Match extends Component {
    constructor(params) {
        super(params)

        this.laodedMatchData = this.laodedMatchData.bind(this)
        this.loadData = this.loadData.bind(this)
        this.toggleExpand = this.toggleExpand.bind(this)

        this.loading = false


        this.element = ""
        this.props = params
        this.state = {
            matchId: params.matchid,
            changes: params.changes,
            matchData: [],
            id: params.id,
            expand: false
        }
    }

    laodedMatchData(data) {
        this.setState({ matchData: data })
    }

    loadData() {

        if (!inViewport(this.element)) {
            return
        }
        if (this.loading === false) {
            this.loading = true;
            document.removeEventListener("scroll", this.loadData)
            get("https://challenges.darkintaqt.com/api/v1/np-match/" + this.state.matchId, this.laodedMatchData)
        }
    }

    componentDidMount() {
        // TODO: Load match using get()
        // add api endpoint in v1 first
        this.element = document.getElementById(this.state.matchId)
        this.loadData()

        document.addEventListener("scroll", this.loadData)
    }

    toggleExpand() {
        if (this.state.expand === true) {
            this.setState({ expand: false })
            return
        }
        this.setState({ expand: true })
    }

    render() {
        let matchdata = []
        if (this.state.matchData.length === 0) {
            matchdata = <Loader></Loader>
        } else {
            let match = this.state.matchData
            let player

            if (!checkExists(match.participants[this.props.id])) {
                matchdata = "error"
            } else {
                player = match.participants[this.props.id]
            }


            let win = player.win
            if (match.gameDuration < 500) {
                win = "remake"
            }

            switch (win) {
                case true:
                    win = "win";
                    break
                case false:
                    win = "loss";
                    break
                default:
                    break
            }

            let c = 0
            let items = player.items.map(function (item) {
                c++;
                return <LazyLoadImage src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + item + ".png.webp"} alt="" key={item + "" + c} placeholderSrc="https://cdn.darkintaqt.com/lol/c-assets/items/0.png.webp" height={25} width={25} />

            })

            matchdata = <Fragment>
                <div className={css.left + " " + css[win]}></div>

                <div className={css.champion}>
                    <img src={"https://lolcdn.darkintaqt.com/cdn/champion/" + player.champion[0] + "/tile"} alt={player.champion[1]} />
                </div>
                <div className={css.text + " " + css[win]}>
                    <p className={css.gamemode}>{getQueue(match.queueId)}</p>
                    <p className={css.wintext}>{win} <span>{secondsToMMSS(match.gameDuration)}</span></p>
                    <p className={css.date}><Timestamp date={match.gameEndTimestamp} /></p>
                </div>
                <div className={css.kda}>
                    <p>{player.kda.join(" / ")}</p>
                </div>
                <div className={css.items}>
                    {items}
                </div>
            </Fragment>
        }

        let same = [];
        let leveledUp = [];

        let challenges = this.state.changes

        let data = []

        for (let i = 0; i < challenges.length; i++) {
            const challenge = challenges[i];
            let isNew = false
            if (challenge["old"]["tier"] === challenge["new"]["tier"]) {
                same.push(challenge)
            } else {
                leveledUp.push(challenge)
                isNew = true
            }

            if (challenge.challengeId < 10) { continue }

            if (challenge["new"]["points"] - challenge["old"]["points"] === 0) {
                console.log(challenge.challengeId);
                continue
            }

            data.push(<div key={"challenge" + i} className={css["levelUp" + isNew]}>
                <LazyLoadImage src={"https://lolcdn.darkintaqt.com/s/c-" + challenge["challengeId"].toString(16) + "-" + intToTier(challenge["new"]["tier"])} alt="" placeholderSrc="https://cdn.darkintaqt.com/lol/c-assets/items/0.png.webp" height={30} width={30} />
                <p>+{beautifyNum(challenge["new"]["points"] - challenge["old"]["points"], true, 1000)}</p>

            </div >)
        }

        data = data.slice(0, 6)

        if (data.length === 0) {
            data = <div style={{ width: "100%", display: "flex", alignItems: "center", padding: "0" }}>
                <p>No challenges progressed during this game</p>
            </div>
        }

        let allChallenges = []
        if (this.state.expand === true) {
            for (let i = 0; i < challenges.length; i++) {
                const challenge = challenges[i];
                if (challenge.challengeId < 10) { continue }

                if (challenge["new"]["points"] - challenge["old"]["points"] === 0) {
                    console.log(challenge.challengeId);
                    continue
                }
                allChallenges.push(<ChallengeObject
                    key={parseInt(challenge["challengeId"])}
                    tier={intToTier(challenge["new"]["tier"])}
                    title={getChallenge(challenge["challengeId"])["translation"]["name"]}
                    subtitle={"+" + beautifyNum(challenge["new"]["points"] - challenge["old"]["points"], true, 1000)}
                    description={getChallenge(challenge["challengeId"])["translation"]["description"]}
                    href={"/challenges/" + challenge["challengeId"]}
                    forceCompact={true}
                >

                </ChallengeObject>)
            }
        }

        return <div className={css.match + " " + css["expanded-" + this.state.expand]} id={this.state.matchId}>
            <div className={css.matchdata} onClick={this.toggleExpand}>
                {matchdata}
            </div>
            <div className={css.challengedata} onClick={this.toggleExpand}>
                <div className={css.progress}>
                    <p>
                        <span>{leveledUp.length} <i className="fa-solid fa-angles-up"></i> </span>Upgraded
                    </p>

                    <p>
                        <span>{same.length}<i className="fa-solid fa-angles-right"></i> </span>Progressed
                    </p>
                </div>
                <div className={css.progressed}>
                    {data}
                </div>
                <div className={css.button}>
                    <i className="fa-solid fa-caret-down"></i>
                </div>
            </div>
            {this.state.expand === true ? <div className={css.overview}>
                {allChallenges}
            </div> : null}
        </div>
    }
}