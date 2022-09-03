import { checkExists } from "../func/arrayManipulationFunctions.ts"
import { beautifyNum } from "../func/beautify.ts"
import css from "../css/progressbar.module.css"

export default function ProgressBar(params) {
    if (!checkExists(params.progress) || !checkExists(params.max) || !checkExists(params.width)) {
        console.error("Missing parameters for progressbar")
        return ""
    }

    return <div className={css.progress} style={{ width: params.width + "px" }}>
        <p className={css.text}>{beautifyNum(params.progress)} / {beautifyNum(params.max)}</p>
        <div className={css.indicator} style={{ width: "calc(" + (params.width + 2) + "px * " + (params.progress / params.max) + ")" }}></div>
    </div>

}