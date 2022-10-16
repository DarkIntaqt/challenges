export function strtolower(value) {

    return ("" + value).toLowerCase();
}


/**
 * Capitilize a string
 * @param {string} input 
 * @returns capitilized string
 */
export function capitalize(input) {

    if (typeof input === "string") {

        if (input.length > 1) {

            // set to lowercase first
            input = strtolower(input)

            input = input.split(" ").length > 0 ? input.split(" ").map((item) => item[0].toUpperCase() + item.substring(1)).join(" ") : input[0].toUpperCase() + input.substring(1)

        }

    }

    return input

}
