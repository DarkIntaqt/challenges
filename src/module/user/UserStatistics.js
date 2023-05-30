import { Component } from "react";
import Loader from "../Loader";
import css from "../../css/stats.module.css"
import ProgressBar from "../ProgressBar";
import config from "../../config";
import statsCalculateTotalPoints from "./statsCalculateTotalPoints";
import tierIdToPoints, { intToTier, tierToInt } from "../../func/tierFunctions";
import Chart from "chart.js/auto";
import { capitalize, strtolower } from "../../func/stringManipulation"
import orderChallenges from "./orderChallenges";

import { checkExists } from "../../func/arrayManipulationFunctions.js";

import { beautifyNum } from "../../func/beautify.js"
import { withTranslation } from "react-i18next";
import getChallenge from "../../func/getChallenge";
import goTo from "../../func/goTo";


class UserStatistics extends Component {
    constructor(props) {
        super(props)

        this.chart = 0

        this.props = props

        this.state = {
            translation: props.t
        }

    }

    showGraph() {
        const user = this.props.summoner
        const t = this.state.translation

        if (user.challenges.length === 0) { return }

        let chartStatus = Chart.getChart(css["distributionChart"]);
        if (checkExists(chartStatus)) {
            chartStatus.destroy();
        }

        let tiers = config.tiers.map((tier) => { return capitalize(t(strtolower(tier))) })
        tiers[0] = capitalize(t("unranked"));

        const labels = tiers;

        const data = {
            labels: labels,
            datasets: [{
                label: 'challenges in tier',
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--selected'),
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--selected'),
                data: this.challenges
            }]
        };

        const chartConfig = {
            type: 'line',
            data: data,
            options: {
                animation: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            drawBorder: true,
                            color: getComputedStyle(document.documentElement).getPropertyValue('--dark3'),
                        }
                    },
                    y: {
                        grid: {
                            drawBorder: false,
                            color: getComputedStyle(document.documentElement).getPropertyValue('--dark3'),
                        },
                    }
                }
            }
        };

        // render chart
        new Chart(
            document.getElementById(css["distributionChart"]),
            chartConfig
        );
    }

    componentDidMount() {
        this.showGraph()
    }

    componentDidUpdate() {
        this.showGraph()
    }

    render() {

        const t = this.state.translation
        let user = JSON.parse(JSON.stringify(this.props.summoner));
        user.challenges = orderChallenges(user.challenges, "level", { gamemode: [], type: [], category: [] })

        if (user.challenges.length === 0) {

            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Statistics...</p>
            </div>

        }
        user["categories"] = {}
        for (let i = 0; i < user.challenges.length; i++) {
            const challenge = user.challenges[i];
            if (challenge[0] < 10) {
                user.categories[challenge[6].id] = {
                    current: challenge[2],
                    max: challenge[6]["thresholds"][intToTier(challenge[1] + 1)] ?? challenge[6]["thresholds"][intToTier(challenge[1])],
                    level: intToTier(challenge[1])
                }
            }

        }

        const categories = ["IMAGINATION", "COLLECTION", "TOTAL", "TEAMWORK", "EXPERTISE"]

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            if (!Object.keys(user.categories).includes(category)) {
                user.categories[category] = {
                    current: 0,
                    max: 1,
                    level: "UNRANKED"
                }
            }

        }

        document.title = `${user.summonerName}'s Challenge Statistics`

        const tiers = statsCalculateTotalPoints(user.challenges)

        let thresholdTable = []
        let challenges = []
        let points = []
        let totalPoints = 0;
        let totalChallenges = 0

        for (let index = 0; index < config.tiers.length; index++) {
            const tier = config.tiers[index];

            totalPoints += tierIdToPoints(tierToInt(tier)) * tiers[tier]
            totalChallenges += tiers[tier]
            points.push(tierIdToPoints(tierToInt(tier)) * tiers[tier])
            challenges.push(tiers[tier])

            thresholdTable.unshift(<div key={"threshold" + index} className={css.rowParentTableRow}>
                <p className={tier} style={{ color: "var(--type)", textAlign: "center" }}>{capitalize(t(strtolower(tier.replace("NONE", "UNRANKED"))))}</p>
                <p>{tiers[tier]}</p>
                <p>{tierIdToPoints(tierToInt(tier))} {t("pts")}</p>
                <p>{beautifyNum(tierIdToPoints(tierToInt(tier)) * tiers[tier])} {t("pts")}</p>
            </div>)

        }

        let pointsAverage = 0

        if (totalChallenges > 0 && totalPoints > 0) {
            pointsAverage = Math.round((totalPoints / totalChallenges) * 10) / 10
        }

        this.challenges = challenges
        this.points = points

        thresholdTable.push(<div key={"threshold-total"} className={css.rowParentTableRow} style={{ backgroundColor: "var(--dark2)", borderRadius: "0 0 5px 5px" }}>
            <p style={{ color: "white", textAlign: "center" }}>TOTAL</p>
            <p>{totalChallenges}</p>
            <p>ø {pointsAverage} {t("pts")}</p>
            <p style={{ fontWeight: "bold" }}>{beautifyNum(totalPoints)} {t("pts")}</p>
        </div>)

        // create placeholder values for not-leveled challenges
        for (let index = 0; index < 5; index++) {
            if (typeof user.categories[index.toString()] === "undefined") {
                user.categories[index.toString()] = {
                    current: 0,
                    max: 0,
                    level: "NONE"
                }
            }
        }

        return <section>
            <div className={css.categories}>

                <a className={css.category + " " + user.tier} href="/challenge/0" onClick={goTo}>

                    <p>
                        <img src={"https://cdn.darkintaqt.com/lol/static/challenges/crystal.svg"} alt="crystal" />
                        {t("Total Points")}
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories["0"].current}
                        max={user.categories["0"].max}
                    />
                </a>

                <a className={css.category + " " + user.categories["5"].level} href="/challenge/5" onClick={goTo}>

                    <p>
                        <img src={config.images["5"]} alt="collection" />
                        {capitalize(getChallenge(5).translation.name)}
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories["5"].current}
                        max={user.categories["5"].max}
                    />
                </a>

                <a className={css.category + " " + user.categories["2"].level} href="/challenge/2" onClick={goTo}>
                    <p>
                        <img src={config.images["2"]} alt="expertise" />
                        {capitalize(getChallenge(2).translation.name)}
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories["2"].current}
                        max={user.categories["2"].max}
                    />
                </a>

                <a className={css.category + " " + user.categories["3"].level} href="/challenge/3" onClick={goTo}>

                    <p>
                        <img src={config.images["3"]} alt="Veterancy" />
                        {capitalize(getChallenge(3).translation.name)}
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories["3"].current}
                        max={user.categories["3"].max}
                    />
                </a>

                <a className={css.category + " " + user.categories["1"].level} href="/challenge/1" onClick={goTo}>

                    <p>
                        <img src={config.images["1"]} alt="Imagination" />
                        {capitalize(getChallenge(1).translation.name)}
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories["1"].current}
                        max={user.categories["1"].max}
                    />
                </a>

                <a className={css.category + " " + user.categories["4"].level} href="/challenge/4" onClick={goTo}>

                    <p>
                        <img src={config.images["4"]} alt="Teamwork" />
                        {capitalize(getChallenge(4).translation.name)}
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories["4"].current}
                        max={user.categories["4"].max}
                    />
                </a>

            </div>

            <div className={css.rowParent}>
                <div className={css.seoArea}>
                    <h2>{t("Total Points")}</h2>
                    <span> {t("How your total points are calculated")}</span>
                </div>
                <div className={css.rowParentTable}>

                    <div className={css.rowParentTableRow + " " + css.rowParentTableRowHeading}>
                        <p>{t("Tier")}</p>
                        <p>{t("Challenges")}</p>
                        <p>{t("Points / Challenge")}</p>
                        <p>{t("Total Points")}</p>
                    </div>

                    {thresholdTable}
                </div>
            </div>
            <div className={css.rowParent}>
                <div className={css.seoArea}>
                    <h2>{t("Challenge Distribution")}</h2>
                </div>
                <canvas id={css["distributionChart"]}></canvas>
            </div>

            <div className={css.rowParent}>
                <p className={css.advertisement}>
                    {t("Tell us which stats you want to see here")}<br />
                    <a href="https://github.com/DarkIntaqt/challenges/issues" target="_blank" rel="noreferrer">Give Feedback</a>
                </p>
            </div>
        </section>
    }
}

export default withTranslation()(UserStatistics);