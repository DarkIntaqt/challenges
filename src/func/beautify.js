// beautify numbers - add dots to < 1M and shortend larger numbers
export function beautifyNum(num, minify = true) {
    if (typeof num === "undefined") {
        return "0"
    }

    if (num >= 1000000 && minify === true) {
        var unitlist = ["", "K", "M", "G"];
        let sign = Math.sign(num);
        let unit = 0;

        while (Math.abs(num) > 1000) {
            unit = unit + 1;
            num = Math.floor(Math.abs(num) / 10) / 100;
        }
        return sign * Math.abs(num) + unitlist[unit];
    }

    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}