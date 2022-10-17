export function tierToInt(tier) {
    switch (tier) {
        case "UNRANKED":
        case "NONE":
            return 0
        case "IRON":
            return 1
        case "BRONZE":
            return 2
        case "SILVER":
            return 3
        case "GOLD":
            return 4
        case "PLATINUM":
            return 5
        case "DIAMOND":
            return 6
        case "MASTER":
            return 7
        case "GRANDMASTER":
            return 8
        case "CHALLENGER":
            return 9
        default:
            return 0
    }
}

export function intToTier(inttier) {
    switch (inttier) {
        case -1:
            return "UNRANKED"
        case 1:
            return "IRON"
        case 2:
            return "BRONZE"
        case 3:
            return "SILVER"
        case 4:
            return "GOLD"
        case 5:
            return "PLATINUM"
        case 6:
            return "DIAMOND"
        case 7:
            return "MASTER"
        case 8:
            return "GRANDMASTER"
        case 9:
            return "CHALLENGER"
        case 0:
        default:
            return "NONE"

    }
}