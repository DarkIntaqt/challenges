import getChallenge from "./getChallenge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import aboutChallenge from "../css/aboutChallenge.module.css"
import { Fragment } from "react";
import capstone from "../img/capstone.svg"
import goTo from "../func/goTo.js";

export default function showChallengePath(challenges, challenge) {
    // getChallenge
    window.JSONPREQUEST = challenges;


    // define parentChallenge and categoryChallenge
    let parent = getChallenge(challenge.parent)
    let category = getChallenge(challenge.parentCategory)


    // set category to parent if they are the same or parent is a key-capstone
    if (category.id === 0 && parent.id !== 0 && (parent.id < 10 || parent.id === 2022000)) {
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

                {generateObject(challenge, false)}

                <div className={aboutChallenge.line}></div>

                <p className={aboutChallenge.faqcapstone}>
                    {capstonetext}
                </p>
            </div>

        }

        // else return challenge and parent (key-capstone)
        return <div className={aboutChallenge.pathArea}>

            <a href={"/challenge/" + category.id} className={aboutChallenge.category} onClick={goTo}>

                {typeof category.tags.isCapstone !== "undefined"
                    ? <img src={capstone} alt="" className={aboutChallenge.capstone} />
                    : null}

                <LazyLoadImage height={28} width={28} src={"https://cdn.darkintaqt.com/lol/static/challenges/" + category.translation.name.toLowerCase().replace(" ", "") + ".webp"} alt={""} />

                <p>
                    {category.translation.name}
                </p>
            </a>

            {generateObject(challenge)}

            <div className={aboutChallenge.line}></div>

            <p className={aboutChallenge.faqcapstone}>
                {capstonetext}
            </p>
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


    /**
     * Function to generate a react object which shows a challenge
     * @param {object} content 
     * @param {boolean} genLine 
     * @returns React object containing the name and the image of a challenge
     */
    function generateObject(content, genLine = true) {

        // Additional stylesheet might be needed, as the challenge will be colored blue if it is the current one
        let additionalStylesheet = ""

        if (content.id === challenge.id) {

            additionalStylesheet = " " + aboutChallenge.this

        }

        return <Fragment key={content.id}>

            {genLine ?
                <div className={aboutChallenge.line}></div>
                : null}

            <a href={"/challenge/" + content.id} className={aboutChallenge.category + additionalStylesheet} onClick={goTo}>

                {typeof content.tags.isCapstone !== "undefined"
                    ? <img src={capstone} alt="" className={aboutChallenge.capstone} /> :
                    null}

                <LazyLoadImage height={28} width={28} src={
                    "https://lolcdn.darkintaqt.com/s/C-" + (content.id * 3).toString(16) + "-master"
                } alt={""} />

                <p>

                    {content.translation.name}

                </p>

            </a>

        </Fragment>
    }


    // Returns the right section of the challenge page, containing all the paths the current challenge has
    return <div className={aboutChallenge.pathArea}>

        <a href={"/challenge/" + category.id} className={aboutChallenge.category} onClick={goTo}>

            {typeof category.tags.isCapstone !== "undefined" ?
                <img src={capstone} alt="" className={aboutChallenge.capstone} />
                : null}

            <LazyLoadImage height={28} width={28} src={"https://cdn.darkintaqt.com/lol/static/challenges/" + category.translation.name.toLowerCase().replace(" ", "") + ".webp"} alt={""} />

            <p>
                {category.translation.name}
            </p>
        </a>

        {moreChallenges}

        {generateObject(parent)}

        {generateObject(challenge)}

        {typeof challenge.tags.isCapstone !== "undefined" ?
            <p className={aboutChallenge.faqcapstone}>{capstonetext}</p>
            : null}
    </div>

}