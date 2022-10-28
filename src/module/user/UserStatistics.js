import { Component } from "react";
import Loader from "../Loader";
import css from "../../css/stats.module.css"
import ProgressBar from "../ProgressBar";
import config from "../../config";
import statsCalculateTotalPoints from "./statsCalculateTotalPoints";
import tierIdToPoints, { tierToInt } from "../../func/tierFunctions";
import Chart from "chart.js/auto";
import { capitalize } from "../../func/stringManipulation"

import { checkExists } from "../../func/arrayManipulationFunctions.ts";

import { beautifyNum } from "../../func/beautify.ts"


export default class UserStatistics extends Component {
    constructor(props) {
        super(props)

        this.chart = 0

        this.props = props

    }

    showGraph() {
        const user = this.props.summoner

        if (user.challenges.length === 0) { return }

        let chartStatus = Chart.getChart(css["distributionChart"]);
        if (checkExists(chartStatus)) {
            chartStatus.destroy();
        }

        let tiers = config.tiers.map((tier) => { return capitalize(tier) })
        tiers[0] = "Unranked";

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

        const user = this.props.summoner

        if (user.challenges.length === 0) {

            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Statistics...</p>
            </div>

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
                <p className={tier} style={{ color: "var(--type)", textAlign: "center" }}>{tier.replace("NONE", "UNRANKED")}</p>
                <p>{tiers[tier]}</p>
                <p>{tierIdToPoints(tierToInt(tier))} pts</p>
                <p>{beautifyNum(tierIdToPoints(tierToInt(tier)) * tiers[tier])} pts</p>
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
            <p>ø {pointsAverage} pts</p>
            <p style={{ fontWeight: "bold" }}>{beautifyNum(totalPoints)} pts</p>
        </div>)


        return <section>
            <div className={css.categories}>

                <div className={css.category + " " + user.tier}>

                    <p>
                        <img src={"https://cdn.darkintaqt.com/lol/static/challenges/crystal.svg"} alt="crystal" />
                        Total Points
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.points[0]}
                        max={user.points[1]}
                    />
                </div>

                <div className={css.category + " " + user.categories.COLLECTION.level}>

                    <p>
                        <img src={config.images.collection} alt="collection" />
                        Collection
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories.COLLECTION.current}
                        max={user.categories.COLLECTION.max}
                    />
                </div>

                <div className={css.category + " " + user.categories.EXPERTISE.level}>
                    <p>
                        <img src={config.images.expertise} alt="expertise" />
                        Expertise
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories.EXPERTISE.current}
                        max={user.categories.EXPERTISE.max}
                    />
                </div>

                <div className={css.category + " " + user.categories.VETERANCY.level}>

                    <p>
                        <img src={config.images.veterancy} alt="Veterancy" />
                        Veterancy
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories.VETERANCY.current}
                        max={user.categories.VETERANCY.max}
                    />
                </div>

                <div className={css.category + " " + user.categories.IMAGINATION.level}>

                    <p>
                        <img src={config.images.imagination} alt="Imagination" />
                        Imagination
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories.IMAGINATION.current}
                        max={user.categories.IMAGINATION.max}
                    />
                </div>

                <div className={css.category + " " + user.categories.TEAMWORK.level}>

                    <p>
                        <img src={config.images.teamwork} alt="Teamwork" />
                        Teamwork
                    </p>
                    <ProgressBar
                        width={100}
                        progress={user.categories.TEAMWORK.current}
                        max={user.categories.TEAMWORK.max}
                    />
                </div>

            </div>

            <div className={css.rowParent}>
                <div className={css.seoArea}>
                    <h2>Total Points</h2>
                    <span> How your total points are calculated</span>
                </div>
                <div className={css.rowParentTable}>

                    <div className={css.rowParentTableRow + " " + css.rowParentTableRowHeading}>
                        <p>Tier</p>
                        <p>Challenges</p>
                        <p>Points / challenge</p>
                        <p>Total Points</p>
                    </div>

                    {thresholdTable}
                </div>
            </div>
            <div className={css.rowParent}>
                <div className={css.seoArea}>
                    <h2>Challenge Distribution</h2>
                </div>
                <canvas id={css["distributionChart"]}></canvas>
            </div>

            <div className={css.rowParent}>
                <p className={css.advertisement}>
                    Tell us which stats you want to see here<br />
                    <a href="https://github.com/DarkIntaqt/challenges/issues" target="_blank" rel="noreferrer">Give Feedback</a>
                </p>
            </div>
            <Ad></Ad>
        </section>
    }
}