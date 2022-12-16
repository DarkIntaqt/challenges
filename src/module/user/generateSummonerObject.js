import { serverToHumanReadable } from "../../func/server"
import { intToTier } from "../../func/tierFunctions"

export default function generateSummonerObject(summoner) {

    const challenges = summoner.challenges;

    let tier = summoner.tier;

    for (let i = 0; i < challenges.length; i++) {
        const challenge = challenges[i];
        if (challenge[0] === 0) {
            tier = challenge[1];
            break;
        }

    }

    return {
        tier: intToTier(tier),
        summonerIcon: summoner.icon,
        summonerName: summoner.name,
        selections: summoner.selections,
        titles: summoner.title,
        challenges: challenges,
        categories: summoner.categoryPoints,
        points: summoner.points,
        id: summoner.id,
        server: serverToHumanReadable(summoner.region)
    }
}