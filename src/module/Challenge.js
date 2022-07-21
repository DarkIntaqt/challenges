import { Component, Fragment } from "react";
import Error from "./Error"
import { Navigate } from "react-router-dom"
import get from "../func/get"
import css from "../css/user.module.css"
import server from "../func/server"
import TimeAgo from 'react-timeago';

export default class Challenge extends Component {
    constructor(props) {
        super(props)
        this.params = props.params
        this.regions = ["br", "euw", "eune", "jp", "kr", "lan", "las", "na", "oc", "tr"];

        let tempRegion = props.query.toLowerCase();
        if (!this.regions.includes(tempRegion)) {
            tempRegion = "world"
        }

        this.error = this.error.bind(this)
        this.goTo = this.goTo.bind(this)
        this.changeFilter = this.changeFilter.bind(this)
        this.showChallenge = this.showChallenge.bind(this)
        this.state = {
            message: -1,
            filter: tempRegion,
            challenge: {
                icon: 1,
                timestamp: Date.now() / 1000,
                challenge: {
                    translation: {
                        name: "Loading",
                        description: "Loading"
                    }
                }
            },
            extraStyle: ""
        }
    }


    error() {
        this.setState({
            message: <Error></Error>,
        })
    }

    showChallenge(r) {
        document.title = r.challenge.translation.name + " Challenge Overview"
        this.setState({ challenge: r })
    }

    componentDidMount() {
        document.title = "Loading..."
        get(`https://challenges.darkintaqt.com/api/v2/c/?id=${this.params.id}`, this.showChallenge, this.error);
    }

    goTo(e) {
        e.preventDefault();
        let loc = new URL(e.currentTarget.href);
        this.setState({ message: <Navigate to={loc["pathname"] + loc["search"]} replace={false}></Navigate> })
    }

    changeFilter(e) {
        if (this.filter === "world") {
            window.history.replaceState({}, "", "?")
        } else {
            window.history.replaceState({}, "", "?region=" + e.target.id)
        }
        this.setState({ filter: e.target.id });
    }

    render() {
        const challenge = this.state.challenge
        const regions = this.regions
        const absoluteRegion = this.state.filter
        let region = absoluteRegion;
        if (absoluteRegion === "world") {
            region = window.region ?? "na"
        }

        let filters = [<button key={"world"} onClick={this.changeFilter} className={css.world} id="world">Global</button>];
        for (let i = 0; i < regions.length; i++) {
            filters.push(<button key={i} onClick={this.changeFilter} className={css[regions[i]]} id={regions[i]}>{regions[i]}</button>)
        }

        let dynamic = {
            "gm": "", "c": "", "placeholder": <Fragment>
                <span> <i className="fa-solid fa-circle-info"></i></span>
                <div>
                    <p>This is a dynamic threshold. This means that this value adjusts itself automatically to the lowest value in the tier. To reach this tier, you need at least as many points or better. </p>
                </div>
            </Fragment>
        }

        let summoner = []
        let thresholds = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]

        let icon = "https://lolcdn.darkintaqt.com/s/C-" + challenge.icon + "-master"

        // Not loaded yet
        if (challenge.icon === 1) {
            summoner = window.loadingUI

            icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        } else if (challenge.challenge.leaderboard === true) {
            thresholds = challenge.stats[server("machine", region)]

            if (thresholds[9] !== "-") {
                dynamic["c"] = dynamic["placeholder"]
            }
            if (thresholds[8] !== "-") {
                dynamic["gm"] = dynamic["placeholder"]
            }

            // create list with summoners
            let summoners = []
            if (absoluteRegion === "world") {
                let counters = {};
                for (let i = 0; i < regions.length; i++) {
                    for (let ii = 0; ii < challenge.summoner[regions[i]].length; ii++) {
                        if (typeof counters[regions[i]] === "undefined") {
                            counters[regions[i]] = 1
                        }
                        challenge.summoner[regions[i]][ii].push(regions[i])
                        challenge.summoner[regions[i]][ii].push(counters[regions[i]])
                        summoners.push(challenge.summoner[regions[i]][ii])
                        counters[regions[i]]++
                    }

                }
                summoners.sort((a, b) => {
                    // Order by name if same value
                    if (a[1] === b[1]) {
                        return a[0] < b[0] ? -1 : +(a[0] > b[0])
                    }
                    return b[1] - a[1]
                })
            } else {
                summoners = challenge.summoner[absoluteRegion]
                for (let i = 0; i < summoners.length; i++) {
                    summoners[i].push(absoluteRegion)
                    summoners[i].push(i + 1)

                }
            }
            for (let i = 0; i < summoners.length; i++) {
                const player = summoners[i];
                let pos = css.normal;
                if (i === 0) {
                    pos = css.pos1
                } else if (i < 10) {
                    pos = css.top10
                } else if (i < 100) {
                    pos = css.top100
                }
                summoner.push(<a className={player[2] + " " + css.challenge + " " + pos} href={"/" + player[3] + "/" + player[0]} key={player[0] + player[3]} onClick={this.goTo}>
                    <div className={css.position}>#{i + 1}</div>
                    <p className={css.title}>{player[0]}
                        <span>
                            #{player[4]} in {server("long", player[3])}
                        </span>
                    </p>
                    <p className={css.values}>{player[1]}</p>
                </a>)

            }

        } else {
            thresholds = challenge.challenge.thresholds
            summoner = <div className={css.disabledMessage + " GRANDMASTER"}>Leaderboards aren't enabled for this challenge<br /><br /><span className={css.details}>Why? Because it is not possible to "scale" in this challenge, as it has a static highest achievable score</span></div>
        }

        let content = <Fragment>
            <div className={"MASTER " + css.c + " " + css.profile}>
                <img src={icon} alt="" />
                <h1>{challenge.challenge.translation.name} <span>(Updated <TimeAgo date={challenge.timestamp * 1000} />)</span></h1>
                <h2 className={"SILVER"} style={{ margin: "0 5px 5px 10px", cursor: "auto" }}>{challenge.challenge.translation.description}</h2>
                <div className={css.thresholds}>
                    <div className={"IRON"}><i className="fa-solid fa-circle"></i>{thresholds[1]}</div>
                    <div className={"BRONZE"}><i className="fa-solid fa-circle"></i>{thresholds[2]}</div>
                    <div className={"SILVER"}><i className="fa-solid fa-circle"></i>{thresholds[3]}</div>
                    <div className={"GOLD"}><i className="fa-solid fa-circle"></i>{thresholds[4]}</div>
                    <div className={"PLATINUM"}><i className="fa-solid fa-circle"></i>{thresholds[5]}</div>
                    <div className={"DIAMOND"}><i className="fa-solid fa-circle"></i>{thresholds[6]}</div>
                    <div className={"MASTER"}><i className="fa-solid fa-circle"></i>{thresholds[7]}</div>
                    <div className={"GRANDMASTER"}><i className="fa-solid fa-circle"></i>{thresholds[8]}{dynamic["gm"]}</div>
                    <div className={"CHALLENGER"}><i className="fa-solid fa-circle"></i>{thresholds[9]}{dynamic["c"]}</div>
                </div>
            </div>
            <div className={css.filter + " " + css[this.state.filter]}>
                {filters}
            </div>
            <div className={css.parent}>
                {summoner}
            </div>
        </Fragment>;
        if (this.state.message !== -1) {
            content = this.state.message
        }

        return <div className={"object1000 " + css.cc}>
            {content}
        </div>
    }
}