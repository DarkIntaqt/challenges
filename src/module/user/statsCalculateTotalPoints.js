import { removeUnnecessaryChallenges } from "./orderChallenges";
import { intToTier } from "../../func/tierFunctions";
import config from "../../config";

export default function statsCalculateTotalPoints(challenges) {

    challenges = removeUnnecessaryChallenges(challenges, { "gamemode": [], "type": [], "category": [] })

    let tiers = {}
    for (let i = 0; i < config.tiers.length; i++) {
        tiers[config.tiers[i]] = 0
    }

    for (let i = 0; i < challenges.length; i++) {
        const challenge = challenges[i];

        if (challenge[0] > 10 && challenge[8] !== "legacy" && challenge[8] !== "2022seasonal") {

            tiers[intToTier(challenge[1])] += 1

        }
    }
    return tiers

}