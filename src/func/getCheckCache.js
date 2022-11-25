import { checkExists } from "./arrayManipulationFunctions.ts"

function checkCache(url) {

    if (checkExists(window.requestCache[url])) {
        if (window.requestCache[url]["timestamp"] > Date.now() - (1000 * 60 * 15) && window.requestCache[url]["body"] !== "") {
            if (window.requestCache[url]["code"] === 200) {
                return true
            }
        } else {
            delete window.requestCache[url]
            console.info("Cache timeout on ressource " + url);
        }
    }
    return false
}

function getCache(url) {
    if (checkCache(url)) {
        return window.requestCache[url]["body"]
    } else {
        return false
    }
}

export { getCache, checkCache }
