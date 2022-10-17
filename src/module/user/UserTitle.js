import { Component } from "react";
import ChallengeObject from "../ChallengeObject";
import getChallenge from "../../func/getChallenge";
import { intToTier } from "../../func/tierFunctions";

import ProgressBar from "../ProgressBar";

import css from "../../css/user.module.css"
import titleCSS from "../../css/userTitle.module.css"

import Loader from "../Loader";
import get from "../../func/get";


export default class UserTitle extends Component {
    constructor(props) {
        super(props)

        this.props = props

        this.state = {
            titles: {},
            message: "Loading Titles..."
        }

        this.addTitle = this.addTitle.bind(this)
        this.error = this.error.bind(this)
    }


    componentDidMount() {
        get("https://cdn.darkintaqt.com/lol/static/titles.json", this.addTitle, this.error)
    }

    addTitle(titles) {

        this.setState({ titles: titles.titles })

    }

    error() {

        this.setState({ message: "Error loading titles" })

    }

    render() {

        const user = this.props.summoner

        if (user.challenges.length === 0 || Object.entries(this.state.titles).length === 0) {

            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>{this.state.message}</p>
            </div>

        }



        const titleList = this.state.titles

        const titles = user.availableTitles.map(function (titleId) {
            return [
                titleId,
                titleList[titleId] ?? "Unknown"
            ]

        }).sort(function (a, b) { return a[1].localeCompare(b[1]) });



        const displayTitles = titles.map(function (title) {
            const titleid = title[0]
            const content = title[1]

            if (titleid === 1) {
                return <ChallengeObject
                    tier="NONE"
                    href={"/titles"}
                    title={content}
                    subtitle={<span>Achieved by 100%</span>}
                    description={"This is a default title. Everyone owns it. Actually it is not even rare, as everyone has unlocked it, so please don't be proud of this one"}
                    key={titleid}
                />
            }
            const titleIdString = titleid.toString()

            const challenge = getChallenge(parseInt(titleIdString.substr(0, titleIdString.length - 2)))
            const tier = intToTier(parseInt(titleIdString.substring(titleIdString.length - 2)))


            let percentage
            try {
                percentage = Math.round(challenge.percentiles[tier] * 1000) / 10
            } catch (error) {
                percentage = "0"
            }
            return <ChallengeObject
                tier={tier}
                href={"/titles"}
                title={content}
                subtitle={<span>Achieved by {percentage}%</span>}
                description={challenge.translation.description}
                key={titleid}
                nexttier="MAXED"
            />
        })

        console.log(titles);

        // for (const titleid in titles) {
        //     if (Object.hasOwnProperty.call(titles, titleid)) {
        //         const title = titles[titleid];
        //         if (titleid === "1") {
        //             challenges.push(<ChallengeObject
        //                 tier="NONE"
        //                 href={"/titles"}
        //                 title={title}
        //                 subtitle={<span>Achieved by 100%</span>}
        //                 description={"This is a default title. Everyone owns it. Actually it is not even rare, as everyone has unlocked it, so please don't be proud of this one"}
        //                 key={titleid}
        //             />)
        //             continue;
        //         }
        //         const challenge = getChallenge(parseInt(titleid.substring(0, titleid.length - 2)))
        //         const tier = intToTier(parseInt(titleid.substring(titleid.length - 2)))


        //         let percentage
        //         try {
        //             percentage = Math.round(challenge.percentiles[tier] * 1000) / 10
        //         } catch (error) {
        //             percentage = "0"
        //         }
        //         challenges.push(<ChallengeObject
        //             tier={tier}
        //             href={"/titles"}
        //             title={title}
        //             subtitle={<span>Achieved by {percentage}%</span>}
        //             description={challenge.translation.description}
        //             key={titleid}
        //             nexttier="MAXED"
        //         />)
        //     }
        // }

        return <div className={`${user.tier}`}>

            <div className={titleCSS.head}>
                <div className={titleCSS.progress}>

                    <ProgressBar
                        width={120}
                        max={Object.keys(this.state.titles).length}
                        progress={titles.length}
                    />
                    <p>Titles unlocked</p>

                </div>
            </div>

            <div className={css.parent}>
                {displayTitles}
            </div >

        </div>
    }
}