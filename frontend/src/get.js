const get = async function (url = "/", callback = function (r) {
    console.log(r)
}, errorCallback = function (e) {
    console.warn(e)
}, debug = false) {
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
    if (request.status === 200) {
        callback(result);
    } else {
        errorCallback(result, request.status)
    }
}

export default get;