import { checkExists } from "../../func/arrayManipulationFunctions.js"
import getChallenge from "../../func/getChallenge";
import { intToTier, tierToInt } from "../../func/tierFunctions";
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function getNextLevel(current, masterOnly = false, pointsOnly = false) {
    if (masterOnly === true) {
        return "MASTER";
    }
    let ranks = ["NONE", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]
    for (let i = 0; i < ranks.length; i++) {
        if (current === ranks[i]) {
            if (ranks[i] === "CHALLENGER") { return "CHALLENGER" }
            return ranks[i + 1];
        }

    }
}



export function removeUnnecessaryChallenges(challengesArray, filters, masterOnly = false, pointsOnly = false, search = "", capstones = true) {

    let challenges = {};
    challengesArray.forEach(challenge => {
        challenges[challenge[0]] = challenge;
    })

    if (search.length > 0) {
        search = escapeRegExp((' ' + search).slice(1));
    }

    const challengesDetailed = (window.JSONPREQUEST || { challenges: [] }).challenges;

    return challengesDetailed.map(function (challengeData) {

        let challenge = [challengeData.id, 0, 0, 0, 0, [1]];

        if (challenges[challengeData.id]) {
            challenge = challenges[challengeData.id]
        }

        if (capstones === false) {
            if (challengeData.tags.isCapstone === "Y") {
                return null;
            }
        }

        if (challengeData === 0) {
            return null
        }

        let pushLater = "none"

        challenge.push(challengeData)

        if (!checkExists(challengeData.queueIds)) {
            console.log(challengeData)
        }

        if (challengeData.queueIds.length > 0) {
            for (let i = 0; i < challengeData.queueIds.length; i++) {

                const queue = challengeData.queueIds[i];

                if ([450, 930, 860].includes(queue)) {
                    pushLater = "aram"
                    if (filters.gamemode.length > 0 && !filters.gamemode.includes("aram")) {
                        return null
                    }
                }

                if ([400, 420, 430, 440].includes(queue)) {
                    pushLater = "summonersrift"
                    if (filters.gamemode.length > 0 && !filters.gamemode.includes("summonersrift")) {
                        return null
                    }
                }

                if ([830, 840, 850, 870, 880, 890].includes(queue)) {
                    pushLater = "bot"
                    if (filters.gamemode.length > 0 && !filters.gamemode.includes("bot")) {
                        return null
                    }
                }

                if ([1700, 1701, 1704].includes(queue)) {
                    pushLater = "arena"
                    if (filters.gamemode.length > 0 && !filters.gamemode.includes("arena")) {
                        return null
                    }
                }
            }
        } else if (filters.gamemode.length > 0) {
            if (filters.gamemode.includes("aram") && [101000, 101300, 101200, 101100].includes(challengeData.id)) {
                pushLater = "aram"
            } else {
                return null
            }
        }

        let parentId = 0

        if (checkExists(challengeData.tags["parent"])) {
            let iterationCount = 0;
            let parentChallengeId = parseInt(challengeData.tags["parent"])
            while (iterationCount < 10) {
                let currentChallenge = getChallenge(parentChallengeId)
                if (checkExists(currentChallenge["tags"]["parent"]) && currentChallenge.id > 10) {
                    parentChallengeId = parseInt(getChallenge(parentChallengeId)["tags"]["parent"])
                } else {
                    iterationCount = 10;
                }
            }
            parentId = getChallenge(parentChallengeId).id
        } else if ([600006, 600010, 600011, 600012, 0].includes(challengeData.id)) {
            parentId = 600006
        } else if (checkExists(challengeData.tags["isCapstone"])) {
            parentId = challengeData.id
        } else {
            parentId = 0
        }

        challenge.push(pushLater)

        if (filters.category.length > 0 && !filters.category.includes(parentId.toString())) {
            if (filters.category.includes("retired-seasonal")) {
                if (parentId !== 2022000 && parentId !== 2023000) {
                    return null
                }
            } else {
                return null
            }
        }
        if (filters.category.length === 0) {
            if (parentId === 2022000 || parentId === 2023000) {
                return null
            }
        }

        challenge.push(parentId)

        if (pointsOnly === true) {
            if (challenge[1] >= 7) {
                return null;
            }
            if (challenge[8] === 600006 || challenge[8].parent === 2022000 || challenge[8] === 2023000 || challenge[8] === 2024100) {
                return null;
            }

            let challengeData = getChallenge(challenge[0]);

            let highestThreshold = 0;
            Object.keys(challengeData.thresholds).forEach((threshold) => {
                const t = tierToInt(threshold);
                if (t > highestThreshold) {
                    highestThreshold = t;
                }
            });

            if (challenge[1] === highestThreshold) {
                return null
            }

        }

        if (search !== "" && (challenge[6].translation.name.toLowerCase().search(search.toLowerCase()) === -1 && challenge[6].translation.description.toLowerCase().search(search.toLowerCase()) === -1)) {
            return null
        }

        return challenge
    })?.filter(x => x !== null)

}


export default function orderChallenges(challenges, filter, extraFilter, masterOnly, pointsOnly, search, capstones) {

    challenges = removeUnnecessaryChallenges(challenges, extraFilter, masterOnly, pointsOnly, search, !capstones)

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
                return a[5][0] > b[5][0] ? 1 : -1
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

                let challenge = a[6];

                if (checkExists(challenge["thresholds"][getNextLevel(tierA, masterOnly)])) {
                    nextLevelA = challenge["thresholds"][getNextLevel(tierA, masterOnly)]
                } else {
                    nextLevelA = challenge["thresholds"][tierA] ? challenge["thresholds"][tierA] : 1;
                }
                if (challenge.tier === "CHALLENGER" && challenge.leaderboard === true) {
                    nextLevelA = challenge["leaderboardThresholds"][0] ?? 0
                }

                nextLevelA = a[2] / nextLevelA;

                challenge = b[6];

                if (checkExists(challenge["thresholds"][getNextLevel(tierB, masterOnly)])) {
                    nextLevelB = challenge["thresholds"][getNextLevel(tierB, masterOnly)]
                } else {
                    nextLevelB = challenge["thresholds"][tierB] ? challenge["thresholds"][tierB] : 1;
                }
                if (challenge.tier === "CHALLENGER" && challenge.leaderboard === true) {
                    nextLevelB = challenge["leaderboardThresholds"][0] ?? 0
                }
                nextLevelB = b[2] / nextLevelB;

                if (nextLevelA >= 1 && nextLevelB >= 1) {
                    return 0
                }

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
                const challenge = [a[6], b[6]]
                return challenge[0]["translation"]["name"] < challenge[1]["translation"]["name"] ? -1 : +(challenge[0]["translation"]["name"] > challenge[1]["translation"]["name"])
            }
            break;

        case "alphabetic-z-a":
            sortAlgorithm = function (a, b) {
                const challenge = [a[6], b[6]]
                return challenge[0]["translation"]["name"] > challenge[1]["translation"]["name"] ? -1 : +(challenge[0]["translation"]["name"] > challenge[1]["translation"]["name"])
            }
            break;

        case "percentile":
            sortAlgorithm = function (a, b) {

                if (a[5][0] === b[5][0]) {
                    // I DON'T LIKE THE SOLUTION, BUT IT WORKS
                    const cA = a[6]

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




                    const cB = b[6]

                    let positionB = 1e100, previousPositionB

                    if (cB.leaderboard === true && b[5].length > 1) {
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


                    return positionA < positionB ? -1 : 1
                }
                return a[5][0] < b[5][0] ? -1 : 1
            }
            break;

        case "timestamp":
            sortAlgorithm = function (a, b) {
                if (a[4] === b[4]) {
                    return 0
                } else {
                    return a[4] > b[4] ? -1 : 1
                }
            }
            break;
        default:
            throw new Error(`Unknown Filter ${filter}`);
    }

    return challenges.sort(sortAlgorithm)

}