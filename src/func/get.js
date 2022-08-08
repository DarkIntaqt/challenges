const get = async function (url = "/", callback = function (r) {
    console.log(r)
}, errorCallback = function (e) {
    console.warn(e)
}, debug = false) {

    if (typeof window.requestCache[url] !== "undefined") {
        if (window.requestCache[url]["timestamp"] > Date.now() - (1000 * 60 * 15)) {
            if (window.requestCache[url]["code"] === 200) {
                callback(window.requestCache[url]["body"]);
            } else {
                errorCallback(window.requestCache[url]["body"], window.requestCache[url]["code"])
            }
            return true
        }
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
        timestamp -= 1000 * 60 * 13;
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