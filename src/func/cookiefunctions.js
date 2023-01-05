/**
 * Sets the cookie "name" to "value" for 31 days
 * @param {string} name 
 * @param {string} value 
 * @returns {boolean}
 */
export function setCookie(name, value) {
    let date = new Date();
    date.setTime(date.getTime() + (31 * 24 * 60 * 60 * 1000));
    const expires = date.toUTCString();

    document.cookie = "_C" + name + "=" + value + ";expires=" + expires + ";path=/;Secure"
    return true
}


export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}