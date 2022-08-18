import { LazyLoadImage } from "react-lazy-load-image-component";
import css from "./../css/challenges.module.css"
import goTo from "../func/goTo.js";
import { checkExists } from "./arrayManipulationFunctions.ts";



export default function generateChallengePointElement(challenge, leaderboards) {
    let regions = ["br", "euw", "eune", "jp", "kr", "lan", "las", "na", "oc", "tr"];
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

    for (let i = 0; i < 3; i++) {
        const player = summoner[i];
        topPlayer.push(<div key={"s" + i} onClick={goTo}>
            <p className={css.position}>#{i + 1}</p>
            <LazyLoadImage height={30} width={30} placeholderSrc={"https://lolcdn.darkintaqt.com/cdn/profileicon/29"} src={"https://lolcdn.darkintaqt.com/cdn/profileicon/" + player[3]} alt={""}></LazyLoadImage>
            <p className={css.name}>
                {player[0]}
            </p>
            <p className={css.region}>#{player[4]}</p>
        </div>);
    }

    return <a href="/challenge/0" className={css.crystal + " CHALLENGER"} onClick={goTo} key="banner">
        <p className={css.crystalHead}>Total Challenge Points Leaderboards</p>
        <div className={css.miniLeaderboard}>
            {topPlayer}
        </div>
        <div className={css.text}>
            This is the leaderboard for all challenges. Whenever you level up a challenge, you gain "challenge points". The more challenge points, the better your position in this leaderboard.<br /><br />Just click here to get to the <b>leaderboards</b>.
        </div>
    </a>
}