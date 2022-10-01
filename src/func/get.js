import { checkCache } from "./getCheckCache";



const get = async function (url = "/", callback = function (r) {
    console.log(r)
}, errorCallback = function (e) {
    console.warn(e)
}, debug = false) {
    if (checkCache(url)) {
        callback(window.requestCache[url]["body"]);
    }

    let request = await fetch(url)

    if (debug) {
        console.log(request);
    }

    let result = await request.text();

    try {
        result = JSON.parse(result);
    } catch (e) {
        if (debug) {
            console.warn(e + " in get(" + url + ")");
        }
    } finally {
        if (debug) {
            console.log(result);
        }

    }

    let timestamp = Date.now();

    if (request.status !== 200) {
        timestamp = (timestamp - 1000 * 60 * 13) + (1000 * 60 * 60 * window.timezoneoffset);
    }

    window.requestCache[url] = {
        "timestamp": timestamp,
        "code": request.status,
        "body": result
    }

    if (request.status === 200) {
        callback(result);
    } else {
        errorCallback(result, request.status)
    }
}

export default get;