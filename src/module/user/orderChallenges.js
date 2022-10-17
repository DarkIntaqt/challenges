import { checkExists } from "../../func/arrayManipulationFunctions.ts"
import getChallenge from "../../func/getChallenge";
import { intToTier } from "../../func/tierFunctions";


export function getNextLevel(current) {
    let ranks = ["NONE", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]
    for (let i = 0; i < ranks.length; i++) {
        if (current === ranks[i]) {
            if (ranks[i] === "CHALLENGER") { return "CHALLENGER" }
            return ranks[i + 1];
        }

    }
}



export default function orderChallenges(challenges, filter) {

    let sortAlgorithm = function (a, b) {

        const aTier = a[1]

        const bTier = b[1]

        if (aTier === bTier) {
            if (a[5][0] === b[5][0]) {
                if (a[5].length === 1) {
                    return 1;
                } else {
                    if (a[5].length === 1) {
                        return -1
                    } else {
                        return a[5][1] < b[5][1] ? -1 : 1
                    }
                }
            } else {
                return a[5][0] < [5][0] ? 1 : -1
            }
        }
        return aTier > bTier ? -1 : 1
    }

    switch (filter) {
        case 'level':
            break;

        case 'levelup':
            sortAlgorithm = function (a, b) {
                let nextLevelA, nextLevelB
                const tierA = intToTier(a[1])
                const tierB = intToTier(b[1])

                let challenge = getChallenge(a[0]);
                if (checkExists(challenge["thresholds"][getNextLevel(tierA)])) {
                    nextLevelA = challenge["thresholds"][getNextLevel(tierA)]
                } else {
                    nextLevelA = challenge["thresholds"][tierA] ? challenge["thresholds"][tierA] : 1;
                }
                if (challenge.tier === "CHALLENGER" && challenge.leaderboard === true) {
                    nextLevelA = challenge["leaderboardThresholds"][0] ?? 0
                }

                nextLevelA = a[2] / nextLevelA;

                challenge = getChallenge(b[0]);

                if (checkExists(challenge["thresholds"][getNextLevel(tierB)])) {
                    nextLevelB = challenge["thresholds"][getNextLevel(tierB)]
                } else {
                    nextLevelB = challenge["thresholds"][tierB] ? challenge["thresholds"][tierB] : 1;
                }
                if (challenge.tier === "CHALLENGER" && challenge.leaderboard === true) {
                    nextLevelB = challenge["leaderboardThresholds"][0] ?? 0
                }
                nextLevelB = b[2] / nextLevelB;

                if (nextLevelA >= 1) {
                    return 5
                }
                if (nextLevelB >= 1) {
                    return -5
                }

                if (Math.round(nextLevelA * 50) === Math.round(nextLevelB * 50)) {
                    return a[0] > b[0] ? -1 : 1
                }

                return Math.round(nextLevelA * 50) > Math.round(nextLevelB * 50) ? -1 : 1

            }
            break;

        case "alphabetic-a-z":
            sortAlgorithm = function (a, b) {
                const challenge = [getChallenge(a[0]), getChallenge(b[0])]
                return challenge[0]["translation"]["name"] < challenge[1]["translation"]["name"] ? -1 : +(challenge[0]["translation"]["name"] > challenge[1]["translation"]["name"])
            }
            break;

        case "alphabetic-z-a":
            sortAlgorithm = function (a, b) {
                const challenge = [getChallenge(a[0]), getChallenge(b[0])]
                return challenge[0]["translation"]["name"] > challenge[1]["translation"]["name"] ? -1 : +(challenge[0]["translation"]["name"] > challenge[1]["translation"]["name"])
            }
            break;

        case "percentile":
            sortAlgorithm = function (a, b) {

                // I DON'T LIKE THE SOLUTION, BUT IT WORKS
                const cA = getChallenge(a[0])

                let positionA = 1e100, previousPositionA

                if (cA.leaderboard === true && a[5].length > 1) {
                    switch (intToTier(a[1])) {
                        case "GRANDMASTER":
                            previousPositionA = cA["leaderboardThresholds"][3] ?? 1
                            break;
                        case "MASTER":
                            previousPositionA = cA["leaderboardThresholds"][5] ?? 1
                            break;
                        default:
                            previousPositionA = 1
                            break;
                    }
                    positionA = (previousPositionA - 1) + a[5][1]
                }




                const cB = getChallenge(b[0])

                let positionB = 1e100, previousPositionB

                if (cA.leaderboard === true && b[5].length > 1) {
                    switch (intToTier(b[1])) {
                        case "GRANDMASTER":
                            previousPositionB = cB["leaderboardThresholds"][3] ?? 1
                            break;
                        case "MASTER":
                            previousPositionB = cB["leaderboardThresholds"][5] ?? 1
                            break;
                        default:
                            previousPositionB = 1
                            break;
                    }
                    positionB = (previousPositionB - 1) + b[5][1]
                }

                if (a[5][0] === b[5][0]) {
                    return positionA < positionB ? -1 : 1
                }
                return a[5][0] < b[5][0] ? -1 : 1
            }
            break;

        case "timestamp":
            sortAlgorithm = function (a, b) {
                if (a[3] === b[3]) {
                    return 0
                } else {
                    return a[3] > b[3] ? -1 : 1
                }
            }
            break;
        default:
            throw new Error("Unknown Filter")
    }

    return challenges.sort(sortAlgorithm)

}