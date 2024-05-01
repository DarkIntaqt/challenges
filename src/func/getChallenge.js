import config from "../config.js"

let thresholds = {}
for (let i = 0; i < config.tiers.length; i++) {
    thresholds[config.tiers[i]] = 0;

}

const fallback = {
    id: "-1",
    translation: {
        name: "ERROR",
        description: "ERROR",
        shortDescription: "ERROR"
    },
    queueIds: [],
    tags: { "parent": 0 },
    thresholds: thresholds
}

/**
 * get a challenge by id
 * @param {number} challengeId 
 * @returns {object} - Challenge Object or 0
 */
export default function getChallenge(challengeId = 0) {
    try {
        if (typeof challengeId === "string") {
            challengeId = parseInt(challengeId)
            console.warn("getChallenge expects number, string '" + challengeId + "' given. ");
        }
        let challenges = window.JSONPREQUEST.challenges;
        for (let i = 0; i < challenges.length; i++) {
            const challenge = challenges[i];
            if (challenge.id === challengeId) {
                return challenge
            }

        }
        console.error(`Didn't load challenge ${challengeId}, return fallback`)
        return fallback;
    } catch (error) {
        console.error(challengeId, error);
        return fallback;
    }
}