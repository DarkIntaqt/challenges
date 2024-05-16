import ChallengeObject from "./module/ChallengeObject";


function fillLoadingUI() {
    let loadingUIObject = []
    for (let i = 0; i < 16; i++) {
        loadingUIObject.push(
            <ChallengeObject
                title="Loading"
                tier={"NONE"}
                subtitle={""}
                description="-"
                key={i}
                href={"#//401306"} />
        )
    }
    return loadingUIObject;
}

const legacy = "https://cdn.darkintaqt.com/lol/static/challenges/legacy.svg"

const config = {
    "windowVariables": {
        "region": "na",
        "requestCache": {},
        "reloadLocation": false,
        "timezoneoffset": new Date().getTimezoneOffset() / 60,
        "loadingUI": fillLoadingUI(),
        "adIds": 0,
        "language": "en",
        "compactMode": true
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
        "ru",
        "tr",
        "ph",
        "sg",
        "th",
        "tw",
        "vn"
    ],
    "cdnBasePath": "https://lolcdn.darkintaqt.com",
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
        131, 6, 47, /* anivia */
        254, 4, 29, /* arcane vi */
        38, 4, 14, /* arcane kassadin */
        43, 4, 7, /* red eye karma */
        2, 4, 25, /* olaf */
        432, 4, 8, /* astronaut bard */
        104, 4, 5, /* pool party graves */
        114, 4, 1, /* fiora */
        131, 4, 26, /* divine diana */
        60, 4, 6, /* halloween elise */
        24, 4, 13, /* jax */
        78, 4, 14 /* xmas poppy */
    ],
    "images": {
        "2": "https://cdn.darkintaqt.com/lol/static/challenges/expertise.svg",
        "5": "https://cdn.darkintaqt.com/lol/static/challenges/collection.svg",
        "1": "https://cdn.darkintaqt.com/lol/static/challenges/imagination.svg",
        "3": "https://cdn.darkintaqt.com/lol/static/challenges/veterancy.svg",
        "4": "https://cdn.darkintaqt.com/lol/static/challenges/teamwork.svg",
        "600006": legacy,
        "0": legacy,
        "601000": "https://lolcdn.darkintaqt.com/cdn/arena.png",
        "2022000": "https://cdn.darkintaqt.com/lol/static/challenges/2022seasonal.svg",
        "seasonal-retired": "https://cdn.darkintaqt.com/lol/static/challenges/retired.svg",
        "2023000": "https://cdn.darkintaqt.com/lol/static/challenges/2023seasonal.svg",
        "2024100": "https://cdn.darkintaqt.com/lol/static/challenges/2024-1seasonal.svg",
        "2024200": "https://cdn.darkintaqt.com/lol/static/challenges/2024-2seasonal.svg",
        "summonersrift": "https://lolcdn.darkintaqt.com/cdn/sr.svg",
        "aram": "https://lolcdn.darkintaqt.com/cdn/ha.svg",
        "bot": "https://lolcdn.darkintaqt.com/cdn/bot.png",
        "arena": "https://lolcdn.darkintaqt.com/cdn/arena.png"
    }
}



export default config;