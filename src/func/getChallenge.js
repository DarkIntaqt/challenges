export default function getChallenge(challengeId = 0) {
    let challenges = window.JSONPREQUEST;
    for (let i = 0; i < challenges.length; i++) {
        const challenge = challenges[i];
        if (challenge.id === challengeId) {
            return challenge
        }

    }
    return 0;
}