import { Component, Fragment } from "react";
import css from "../../css/match.module.css"
import get from "../../func/get";
import Loader from "../Loader";
import { checkExists } from "./../../func/arrayManipulationFunctions.ts";
import Timestamp from "react-timestamps"
import { intToTier } from "./../../func/tierFunctions"
import { beautifyNum } from "../../func/beautify.ts";

const secondsToMMSS = (seconds) => {
    const MM = `${Math.floor(seconds / 60) % 60}`.padStart(2, '0');
    const SS = `${Math.floor(seconds % 60)}`.padStart(2, '0');
    return [MM, SS].join(':')
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

        this.props = params
        this.state = {
            matchId: params.matchid,
            changes: params.changes,
            matchData: [],
            id: params.id
        }
    }

    laodedMatchData(data) {
        this.setState({ matchData: data })
    }

    componentDidMount() {
        // TODO: Load match using get()
        // add api endpoint in v1 first
        get("https://challenges.darkintaqt.com/api/v1/np-match/" + this.state.matchId, this.laodedMatchData)
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
                return <img src={"https://cdn.darkintaqt.com/lol/c-assets/items/" + item + ".png.webp"} alt="" key={item + "" + c} />

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
            if (challenge["old"]["tier"] === challenge["new"]["tier"]) {
                same.push(challenge)
            } else {
                leveledUp.push(challenge)
            }

            if (challenge.challengeId < 10) { continue }

            if (challenge["new"]["points"] - challenge["old"]["points"] === 0) {
                console.log(challenge.challengeId);
                continue
            }

            data.push(<div key={"challenge" + i}>
                <img src={"https://lolcdn.darkintaqt.com/s/c-" + challenge["challengeId"].toString(16) + "-" + intToTier(challenge["new"]["tier"])} alt="" />
                <p>+{beautifyNum(challenge["new"]["points"] - challenge["old"]["points"], true, 1000)}</p>

            </div >)
        }

        if (data.length === 0) {
            data = <div style={{ width: "100%", display: "flex", alignItems: "center", padding: "0" }}>
                <p>No challenges progressed during this game</p>
            </div>
        }

        return <div className={css.match}>
            <div className={css.matchdata}>
                {matchdata}
            </div>
            <div className={css.challengedata}>
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

                </div>
            </div>

        </div>
    }
}