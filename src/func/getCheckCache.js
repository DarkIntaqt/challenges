import { checkExists } from "./arrayManipulationFunctions.js"

/**
 * check if a url exists in cache and is eligible for being used
 * @param {string} url 
 * @returns {boolean}
 */
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

/**
 * returns an object of the cache, if it is valid
 * @param {string} url 
 * @returns {*} - cache object or false
 */
function getCache(url) {
    if (checkCache(url)) {
        return window.requestCache[url]["body"]
    } else {
        return false
    }
}

export { getCache, checkCache }
