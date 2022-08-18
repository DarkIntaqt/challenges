import css from "../css/aboutChallenge.module.css"
import generateObject from "./generateChallengeBlock";
import { Component } from "react";
import { checkExists } from "./arrayManipulationFunctions.ts";


/**
 * 
 * @param {number} challengeId 
 * @returns React Object with all child challenges of a capstone
 */

export default class ShowChildChallenges extends Component {
    constructor(props) {

        super(props)

        if (!checkExists(this.props.challenges) || !checkExists(this.props.challengeid)) {

            this.challenges = []
            this.challengeId = -1;

        } else {
            this.challenges = this.props.challenges
            this.challengeId = this.props.challengeid
        }
        this.state = { showAll: false }

    }

    render() {

        const challenges = this.challenges

        const challengeId = this.challengeId

        try {
            // Check if challenges are loaded is usable
            if (challenges.length <= 0) {

                throw new Error("No challenge object set")

            }

            let counter = 0;

            let childChallenges = challenges.map((challenge) => {

                if (challengeId === 0) {

                    if ([600006, 600010, 600011].includes(challenge.id)) {

                        return []

                    }

                }

                if (parseInt(challenge.parent) === challengeId && challenge.id !== challengeId) {

                    counter++;

                    if (counter > 4 && this.state.showAll === false) {

                        if (counter === 5) {

                            return <div className={css.showMore} onClick={() => { this.setState({ showAll: true }) }} key={"onClickShow"}>
                                <p>Show more...</p>
                            </div>


                        }

                        return []

                    }

                    return generateObject(challenge, false)
                }

                return []

            })

            let overflowRule = {};

            if (counter > 4 && this.state.showAll === true) {
                overflowRule = { overflow: "scroll" }
                childChallenges.push(<div className={css.showMore} key={"onClickHide"} onClick={() => { this.setState({ showAll: false }) }}>
                    <p>Show less</p>
                </div>)
            }



            return <div style={overflowRule} className={css.area}>
                {counter > 0 ? <p>Sub-Challenges</p> : <p><span data-nosnippet><br />This challenge has no sub-challenges. <br /><br />¯\_(ツ)_/¯<br /> seems like a feature</span></p>}
                {childChallenges}
            </div>

        }

        catch (error) {

            console.error(error)

            return [];

        }
    }
}
