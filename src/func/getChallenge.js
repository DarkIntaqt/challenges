export default function getChallenge(challengeId = 0) {
    try {
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