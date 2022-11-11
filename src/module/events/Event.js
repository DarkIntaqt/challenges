import { LazyLoadImage } from "react-lazy-load-image-component";
import cCss from "../../css/challenges.module.css"
import goTo from "../../func/goTo.js";
import { checkExists } from "../../func/arrayManipulationFunctions.ts";
import config from "../../config";
import { Component } from "react";
import css from "../../css/event.module.css"
import get from "../../func/get";

export default class generateChallengePointElement extends Component {
    constructor(props) {
        super(props)
        this.challenges = props.content
        this.updateCompontent = this.updateCompontent.bind(this)
        this.state = {
            content: <div className={cCss.crystal + " NONE"} >

            </div>
        }
    }

    componentDidMount() {

        get("https://challenges.darkintaqt.com/api/v4/c/?id=2022000", this.updateCompontent)

    }

    updateCompontent(leaderboards) {

        // console.log(leaderboards);

        // let challenges = this.challenges

        let regions = config.regions
        let summoner = []
        let counters = {};

        for (let i = 0; i < regions.length; i++) {
            for (let ii = 0; ii < leaderboards.summoner[regions[i]].length; ii++) {
                if (!checkExists(counters[regions[i]])) {
                    counters[regions[i]] = 1
                }
                leaderboards.summoner[regions[i]][ii].push(regions[i])
                leaderboards.summoner[regions[i]][ii].push(counters[regions[i]])
                summoner.push(leaderboards.summoner[regions[i]][ii])
                counters[regions[i]]++
            }

        }
        summoner.sort((a, b) => {
            if (a[1] === b[1]) {
                if (b[5] === a[5]) {
                    return a[0] < b[0] ? -1 : +(a[0] > b[0])
                }
                return a[5] - b[5]
            }
            return b[1] - a[1]
        });

        let topPlayer = []

        for (let i = 0; i < 5; i++) {
            const player = summoner[i];
            topPlayer.push(<div key={"s" + i} onClick={goTo} className={css.player}>
                <p className={css.position}>{i + 1}.</p>
                <LazyLoadImage height={26} width={26} placeholderSrc={"https://lolcdn.darkintaqt.com/cdn/profileicon/29"} src={"https://lolcdn.darkintaqt.com/cdn/profileicon/" + player[3]} alt={""}></LazyLoadImage>
                <p className={css.name}>
                    {player[0]}
                </p>
                <p className={css.region}>{player[4]}</p>
            </div>);
        }

        this.setState({
            content: <a href="/challenge/2022000" className={css.crystal + " DIAMOND " + cCss.crystal} onClick={goTo} key="banner">
                <div className={css.group}>
                    <p className={css.crystalHead}>2022 Seasonal Challenge Leaderboard</p>

                    <div className={css.text}>
                        The 2022 Seasonal Challenges are ending soon. Check out the leaderboards and give your best to gain the limited "Challenjour '22" Title! <br /><br />Just click <b>here</b> to get to the leaderboards.
                    </div>

                </div>
                <div className={css.miniLeaderboard}>
                    {topPlayer}
                </div>

            </a>
        })

    }


    render() {
        return this.state.content
    }
}