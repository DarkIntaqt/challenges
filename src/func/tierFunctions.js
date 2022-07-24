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
        case 0:
            return "IRON"
        case 1:
            return "BRONZE"
        case 2:
            return "SILVER"
        case 3:
            return "GOLD"
        case 4:
            return "PLATINUM"
        case 5:
            return "DIAMOND"
        case 6:
            return "MASTER"
        case 7:
            return "GRANDMASTER"
        case 8:
            return "CHALLENGER"
        default:
            return "NONE"

    }
}