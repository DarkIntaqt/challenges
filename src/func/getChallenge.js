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
        return 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}