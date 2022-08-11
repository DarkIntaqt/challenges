import getChallenge from "./getChallenge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import aboutChallenge from "../css/aboutChallenge.module.css"
import { Fragment } from "react";
import capstone from "../img/capstone.svg"

export default function showChallengePath(challenges, challenge) {
    window.JSONPREQUEST = challenges;

    let parent = getChallenge(challenge.parent)
    let category = getChallenge(challenge.parentCategory)

    if (parent.id === category.id) {

    }

    let between = [];

    if (parent.parent > 10) {
        let tries = 0;
        let temp = parent
        while (temp.parent > 10 || tries > 5) {
            temp = getChallenge(temp.parent);
            console.log(temp);
            tries++;
            between.push(<Fragment key={tries}>
                <div className={aboutChallenge.line}></div>
                <a href={"/challenge/" + temp.id} className={aboutChallenge.category}>
                    {typeof temp.tags.isCapstone !== "undefined" ? <img src={capstone} alt="" className={aboutChallenge.capstone} /> : ""}
                    <LazyLoadImage height={30} width={30} src={"https://lolcdn.darkintaqt.com/s/C-" + (temp.id * 3).toString(16) + "-master"} alt={""} />
                    <p>{temp.translation.name}</p>
                </a>
            </Fragment>)
        }
    }

    return <div>
        <div className={aboutChallenge.pathArea}>
            <a href={"/challenge/" + category.id} className={aboutChallenge.category}>
                {typeof category.tags.isCapstone !== "undefined" ? <img src={capstone} alt="" className={aboutChallenge.capstone} /> : ""}
                <LazyLoadImage height={30} width={30} src={"https://cdn.darkintaqt.com/lol/static/challenges/" + category.translation.name.toLowerCase() + ".webp"} alt={""} />
                <p>{category.translation.name}</p>
            </a>
            {between}
            <div className={aboutChallenge.line}></div>
            <a href={"/challenge/" + parent.id} className={aboutChallenge.category}>
                {typeof parent.tags.isCapstone !== "undefined" ? <img src={capstone} alt="" className={aboutChallenge.capstone} /> : ""}
                <LazyLoadImage height={30} width={30} src={"https://lolcdn.darkintaqt.com/s/C-" + (parent.id * 3).toString(16) + "-master"} alt={""} />
                <p>{parent.translation.name}</p>
            </a>
            <div className={aboutChallenge.line}></div>
            <a href={"/challenge/" + challenge.id} className={aboutChallenge.category + " " + aboutChallenge.this}>
                <LazyLoadImage height={30} width={30} src={"https://lolcdn.darkintaqt.com/s/C-" + (challenge.id * 3).toString(16) + "-master"} alt={""} />
                <p>{challenge.translation.name}</p>
            </a>
        </div>
    </div>
}