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
        let challenges = window.JSONPREQUEST;
        for (let i = 0; i < challenges.length; i++) {
            const challenge = challenges[i];
            if (challenge.id === challengeId) {
                return challenge
            }

        }
        console.error(`Didn't load challenge ${challengeId}, return fallback`)
        return {
            id: "-1",
            translation: {
                name: "Loading",
                description: "Loading",
                shortDescription: "Loading"
            }
        };
    } catch (error) {
        console.error(error);
        return {
            id: "-1",
            translation: {
                name: "Loading",
                description: "Loading",
                shortDescription: "Loading"
            }
        };
    }
}