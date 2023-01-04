import getChallenge from "./getChallenge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import aboutChallenge from "../css/aboutChallenge.module.css"
import { Fragment } from "react";
import capstone from "../img/capstone.svg"
import goTo from "../func/goTo.js";
import generateObject from "./generateChallengeBlock"
import { checkExists } from "./arrayManipulationFunctions.js";

export default function showChallengePath(challenges, challenge) {
    // getChallenge
    window.JSONPREQUEST = challenges;


    // define parentChallenge and categoryChallenge
    let parent = getChallenge(challenge.parent)
    let category = getChallenge(challenge.parentCategory)


    // set category to parent if they are the same or parent is a key-capstone
    if (category.id === 0 && parent.id !== 0 && (parent.id < 10 || parent.id === 2022000 || parent.id === 2023000)) {
        category = parent
    }


    let capstonetext = <Fragment>
        This challenge is a capstone. That means, that this challenge is like a category and has multiple challenges grouped under its name.
    </Fragment>


    // if parent is also the category, they are less options to display
    if (parent.id === category.id) {

        if (parent.parent === challenge.parent) {

            // returns only the challenges, as it is the key-capstone
            return <div className={aboutChallenge.pathArea}>

                <p>Capstones</p>

                {!checkExists(challenge.tags.isCapstone)
                    ?
                    <div className={aboutChallenge.line}></div>

                    : null}

                {generateObject(challenge, false, challenge.id)}

                {checkExists(challenge.tags.isCapstone)
                    ? <Fragment>
                        <div className={aboutChallenge.line}></div>

                        <p className={aboutChallenge.faqcapstone}>
                            {capstonetext}
                        </p>
                    </Fragment>
                    : null}

            </div>

        }

        // else return challenge and parent (key-capstone)
        return <div className={aboutChallenge.pathArea}>

            <p>Capstones</p>

            <a href={"/challenge/" + category.id} className={aboutChallenge.category} onClick={goTo}>

                {checkExists(category.tags.isCapstone)
                    ? <img src={capstone} alt="" className={aboutChallenge.capstone} />
                    : null}

                <LazyLoadImage height={28} width={28} src={"https://cdn.darkintaqt.com/lol/static/challenges/" + category.translation.name.toLowerCase().replace(" ", "") + ".svg"} alt={""} />

                <p>
                    {category.translation.name}
                </p>
            </a>

            {generateObject(challenge, true, challenge.id)}

            {checkExists(challenge.tags.isCapstone)
                ? <Fragment>
                    <div className={aboutChallenge.line}></div>

                    <p className={aboutChallenge.faqcapstone}>
                        {capstonetext}
                    </p>
                </Fragment>
                : null}
        </div>
    }


    // if a challenge has more than 2 parent-challenges, this array will be filled
    let moreChallenges = [];


    // if the challenges parent is not a key-capstone, loop until it is found
    if (parent.parent > 10) {

        let tries = 0;

        let temporaryChallenge = parent

        // max 10 tries
        while (temporaryChallenge.parent > 10 || tries > 5) {

            // set temp to the parent of the temp before
            temporaryChallenge = getChallenge(temporaryChallenge.parent);

            //console.log(temporaryChallenge); // debug
            moreChallenges.push(generateObject(getChallenge(temporaryChallenge.id)))

            tries++;

        }
    }


    // Returns the right section of the challenge page, containing all the paths the current challenge has
    return <div className={aboutChallenge.pathArea}>
        <p>Capstones</p>
        <a href={"/challenge/" + category.id} className={aboutChallenge.category} onClick={goTo}>

            {checkExists(category.tags.isCapstone) ?
                <img src={capstone} alt="" className={aboutChallenge.capstone} />
                : null}

            <LazyLoadImage height={28} width={28} src={"https://cdn.darkintaqt.com/lol/static/challenges/" + category.translation.name.toLowerCase().replace(" ", "") + ".svg"} alt={""} />

            <p>
                {category.translation.name}
            </p>
        </a>

        {moreChallenges}

        {generateObject(parent)}

        {generateObject(challenge, true, challenge.id)}

        {checkExists(challenge.tags.isCapstone) ?
            <p className={aboutChallenge.faqcapstone}>{capstonetext}</p>
            : null}
    </div>

}