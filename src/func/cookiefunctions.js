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