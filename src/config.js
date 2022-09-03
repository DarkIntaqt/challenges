import ChallengeObject from "./module/ChallengeObject";
import challengeCSS from "./css/challengeObject.module.css"

function fillLoadingUI() {
    let loadingUIObject = []
    for (let i = 0; i < 16; i++) {
        loadingUIObject.push(
            <ChallengeObject
                title="Loading"
                tier={challengeCSS["loading"]}
                subtitle={<span>#</span>}
                description="..."
                key={i}
                href={"#"} />
        )
    }
    return loadingUIObject;
}


const config = {
    "windowVariables": {
        "region": "na",
        "requestCache": {},
        "reloadLocation": false,
        "timezoneoffset": new Date().getTimezoneOffset() / 60,
        "loadingUI": fillLoadingUI()
    },
    "config": {
        "reloadAfter": 3600000
    },
    "startScreenImages": [
        150, 4, 3, /*winter gnar */
        254, 4, 29, /* arcane vi */
        38, 4, 14, /* arcane kassadin */
        43, 4, 7, /* red eye karma */
        2, 4, 25, /* olaf */
        432, 4, 8, /* astronaut bard */
        104, 4, 5, /* pool party graves */
        114, 4, 1, /* fiora */
        131, 4, 26, /* divine diana */
        60, 4, 6, /* halloween elise */
        99, 4, 29, /* lux */
        78, 4, 14 /* xmas poppy */
    ]
}



export default config;