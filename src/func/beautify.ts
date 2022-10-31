// @ts-ignore
import { checkExists } from "./arrayManipulationFunctions.ts";

// beautify numbers - add dots to < 1M and shortend larger numbers
export function beautifyNum(num: number, minify: boolean = true) {
    if (!checkExists(num)) {
        return "0"
    }
    if (typeof num === "string") {
        num = parseInt(num)
        if (isNaN(num)) {
            return "0"
        }
    }

    if (num > 10000 && minify === true) {
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