import userCss from "./css/user.module.css";


function fillLoadingUI() {
    let loadingUIObject = []
    for (let i = 0; i < 16; i++) {
        loadingUIObject.push(
            <a key={i} className={userCss.challenge + " UNRANKED " + userCss.loading} href="#loading">
                <p className={userCss.title}>Loading
                    <span>Loading</span>
                </p>
                <p className={userCss.description}>Loading</p>
            </a>
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
    ]
}



export default config;