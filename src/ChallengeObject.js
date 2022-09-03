import css from "./css/challengeObject.module.css"
import { beautifyNum } from "./func/beautify.ts"
import { checkExists } from "./func/arrayManipulationFunctions.ts"
import goTo from "./func/goTo";

export default function ChallengeObject(params) {


    const variables = [
        ["tier"],
        ["nexttier", false, ""],
        ["title"],
        ["subtitle"],
        ["description"],
        ["href"],
        ["queueIds", false, null],
        ["progressCurrent", false, false],
        ["progressNext", false, false]
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
                return css[tag]
            }).join(" ")
        } else {
            extraTags = " " + css[challenge[1]]
        }
    }


    return <a
        className={challenge[0] + " " + css.challenge + extraTags} href={challenge[5]}
        onClick={goTo}
    >
        <p className={css.title}>

            {challenge[2]}
            {challenge[3]}

        </p>

        <p className={css.description}>{challenge[4]}</p>

        {challenge[6]}
        {
            challenge[7] !== false ?
                <div className={css.progress}>
                    <p className={css.text}>{beautifyNum(challenge[7])} / {beautifyNum(challenge[8])}</p>
                    <div className={css.indicator} style={{ width: "calc(122px * " + (challenge[7] / challenge[8]) + ")" }}></div>
                </div>
                : null
        }
    </a>
}