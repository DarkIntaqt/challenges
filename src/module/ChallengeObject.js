import css from "../css/challengeObject.module.css"
import { checkExists } from "../func/arrayManipulationFunctions.js"
import { capitalize, strtolower } from "../func/stringManipulation";
import goTo from "../func/goTo";
import ProgressBar from "./ProgressBar";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Fragment } from "react";
import { beautifyNum } from "./../func/beautify.js"
import 'react-lazy-load-image-component/src/effects/opacity.css';

import { useTranslation } from 'react-i18next';

export default function ChallengeObject(params) {

    const { t } = useTranslation();

    const variables = [
        ["tier"],
        ["nexttier", false, ""],
        ["title"],
        ["subtitle"],
        ["description"],
        ["href"],
        ["queueIds", false, null],
        ["progressCurrent", false, false],
        ["progressNext", false, false],
        ["forceFullMode", false, false],
        ["forceCompact", false, false],
        ["progressCurrentSecondary", false, false]
    ];


    let challenge = variables.map(function (content) {
        const exists = checkExists(params[content[0]])
        if (!checkExists(content[1]) && !exists) {
            throw new Error(`Missing attribute "${content[0]}"`)
        }
        if (!exists) {
            return content[2]
        }
        return params[content[0]]

    })

    let extraTags = challenge[1];

    if (challenge[0] !== "") {
        if (typeof challenge[1] === "object") {
            extraTags = " " + challenge[1].map(function (tag) {
                if (!checkExists(css[tag])) { return "" }
                return css[tag]
            }).join(" ")
        } else {
            if (checkExists(css[challenge[1]])) {
                extraTags = " " + css[challenge[1]]
            } else {
                extraTags = ""
            }
        }
    }

    if (challenge[0].toLowerCase() === "none" || challenge[0].toLowerCase() === "unranked") {
        extraTags += " " + css["unranked"]
    }


    // COMPACT
    if ((window.compactMode === true && challenge[9] === false) || challenge[10] === true) {

        return <a
            className={challenge[0] + " " + css.challenge + extraTags + " " + css.compact} href={challenge[5]}
            onClick={goTo}
        >
            <LazyLoadImage
                height={40}
                width={40}
                effect="opacity"
                src={"https://lolcdn.darkintaqt.com/cdn/np-token/" + challenge[5].split("/")[2].split("?")[0] + "/" + challenge[0].toLowerCase().replace("none", "iron")}
                alt={challenge[2]}
            >
            </LazyLoadImage>
            <div className={css.group}>
                <p className={css.heading}>{challenge[2]}</p>
                <p className={css.type}>{challenge[3]} {
                    challenge[7] !== false ?
                        <Fragment> | {beautifyNum(challenge[7])} / {beautifyNum(challenge[8])}</Fragment>
                        : null
                }</p>
            </div>
            <div className={css.modes}>
                {challenge[6]}
            </div>
            <div className={css.description}>
                <p>{challenge[4]}</p>
            </div>
            <p className={css.tier}>
                {capitalize(t(strtolower(challenge[0])))}
            </p>
            <button><i className="fa-solid fa-chevron-down"></i></button>

            {challenge[11] !== false ?
                <div className={`${css.progressBar} ${css.bgprogress}`} style={{
                    width: "calc(calc(100% + 16px) * " + (challenge[11] / challenge[8]) + ")",
                    backgroundColor: "white"
                }}></div> : null}
            {
                challenge[7] !== false ?
                    <div className={css.progressBar} style={{
                        width: "calc(calc(100% + 20px) * " + (challenge[7] / challenge[8]) + ")"
                    }}>

                    </div>
                    : null
            }
        </a>
    }

    return <a
        className={challenge[0] + " " + css.challenge + extraTags + " " + css.full} href={challenge[5]}
        onClick={goTo}
    >
        <p className={css.title}>

            {challenge[2]}
            <span>{challenge[3]}</span>

        </p>

        <p className={css.description}>{challenge[4]}</p>

        {
            challenge[7] !== false ?
                <ProgressBar
                    progress={challenge[7]}
                    max={challenge[8]}
                    width={120}
                />
                : null
        }

        <div className={css.tags}>
            {challenge[6]}
        </div>
    </a>
}