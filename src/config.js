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
    "regions": [
        "br",
        "euw",
        "eune",
        "jp",
        "kr",
        "lan",
        "las",
        "na",
        "oc",
        "tr"
    ],
    "tiers": [
        "NONE",
        "IRON",
        "BRONZE",
        "SILVER",
        "GOLD",
        "PLATINUM",
        "DIAMOND",
        "MASTER",
        "GRANDMASTER",
        "CHALLENGER"
    ],
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
    ],
    "images": {
        "expertise": "https://cdn.darkintaqt.com/lol/static/challenges/expertise.svg",
        "collection": "https://cdn.darkintaqt.com/lol/static/challenges/collection.svg",
        "imagination": "https://cdn.darkintaqt.com/lol/static/challenges/imagination.svg",
        "veterancy": "https://cdn.darkintaqt.com/lol/static/challenges/veterancy.svg",
        "teamwork": "https://cdn.darkintaqt.com/lol/static/challenges/teamwork.svg",
        "legacy": "https://cdn.darkintaqt.com/lol/static/challenges/legacy.svg",
        "seasonal2022": "https://cdn.darkintaqt.com/lol/static/challenges/2022seasonal.svg",
        "summonersrift": "https://lolcdn.darkintaqt.com/cdn/sr.svg",
        "aram": "https://lolcdn.darkintaqt.com/cdn/ha.svg",
        "bot": "https://lolcdn.darkintaqt.com/cdn/bot.png"
    }
}



export default config;