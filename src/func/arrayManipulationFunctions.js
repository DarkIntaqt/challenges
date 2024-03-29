// toggles a value of an array, removes or add it as called
export function toggleValue(toggleObject, toAdd) {
    // Check if all arguments are set
    if (!checkExists(toggleObject) || !checkExists(toAdd)) {
        throw new Error("Not all parameters provided, but required");
    }

    // Check for array
    if (!Array.isArray(toggleObject) || typeof toggleObject !== "object") {
        throw new Error("Expected type of array. " + typeof toggleObject + " given. ");
    }

    // Check for string, bool or num
    if (!["string", "boolean", "number"].includes(typeof toAdd)) {
        throw new Error("Expected type of string, boolean or number. " + typeof toAdd + " given. ");
    }

    // Method: true = added; false = removed
    let method = true

    // Check if already exists
    if (toggleObject.includes(toAdd)) {
        // Remove from array and set method
        toggleObject.splice(toggleObject.indexOf(toAdd), 1)
        method = false
    } else {
        // Push toAdd to array
        toggleObject.push(toAdd)
    }

    return { method: method, result: toggleObject }
}

export function checkExists(exists: any) {
    try {
        if (typeof exists === "undefined") {
            return false
        }
    } catch (error) {
        return false
    }
    return true
}