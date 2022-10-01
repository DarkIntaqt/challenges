import { checkExists } from "./arrayManipulationFunctions.ts"

function checkCache(url) {
    if (checkExists(window.requestCache[url])) {
        if (window.requestCache[url]["timestamp"] > Date.now() - (1000 * 60 * 15) + (1000 * 60 * 60 * window.timezoneoffset) && window.requestCache[url]["body"] !== "") {
            if (window.requestCache[url]["code"] === 200) {
                return true
            }
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