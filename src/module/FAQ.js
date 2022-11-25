export default function FAQ() {

    let faqs = [
        [
            "My challenges are not updating",
            "That's bad. Usually, challenges update around every 15 minutes, leaderboards around every 30 minutes (maybe longer due to caching). If your challenges don't update at all, you may contact me on twitter: @darkintaqt"
        ],
        [
            "The leaderboard positions are wrong",
            "That is our fault. Our leaderboard positions, escpecially the top leaderboards positions are more up to date than the Riot ones. We will keep it that way to serve more accurate leaderboards, sorry about your rankings :/"
        ],
        [
            "My challenge doesn't update even though I'm over the threshold",
            "You will most likely be promoted in the next 24 hours as the Master+ leaderboards do not update immediately. "
        ],
        [
            "I don't want to appear here.",
            "That's sad but ok, so just send me a direct message on twitter: @darkintaqt, and I'll try to remove you within the next 1-2 days. However, this will not prevent you from being lookup up by users who know your name and your username could be displayed longer (1-4 weeks) in search engines. This will also not remove your scores from the leaderboards, only your name and profileIcon. This is because the leaderboards must not be falsified."
        ],
        [
            "What about to U.GG logo on a users profile page?",
            "This website is allowed to use the U.GG logo, but is not affiliated with U.GG. You can visit U.GG <a href=\"https://u.gg\">here</a>"
        ],
        [
            "What about my privacy and the data you collect about me?",
            "League of Legends related data about your summoner profile is stored exactly 15 minutes on our servers. Leaderboard data will be kept updating (almost) forever, as long as you stay in the top ranks (top 250 per region). If you don't want to appear on the leaderboards, read the answer above. <br><br>Also, we collect data such as your IP and browser, read this for further information: <a href=\"https://darkintaqt.com/assets/privacypolicy/\">privacy policy</a> and this: <a href=\"https://darkintaqt.com/assets/impressum/\">imprint</a>"
        ],
        [
            "Still questions?",
            "Reach out to me on <a href=\"https://twitter.com/darkintaqt\">Twitter</a>, <a href=\"https://github.com/DarkIntaqt\">GitHub</a> or visit my <a href=\"https://darkintaqt.com\">website</a>."
        ],
        [
            "This is ugly, I want to change the design",
            "Oh cool. I hate your opinion, but you can build your own version of this on <a href=\"https://github.com/DarkIntaqt/challenges\">GitHub</a> and create a PR with a different (and better) design. <!--<br><br><a rel=\"noreferrer\" href=\"https://github.com/DarkIntaqt/challenges\" target=\"_blank\"><img src='https://opengraph.githubassets.com/challenge-darkintaqt-com/DarkIntaqt/challenges'/ style='width:100%;border-radius:5px;' alt=''></a>-->"
        ],
        [
            "What are these blue check marks?",
            "These checkmarks shows that the shown profile is a beta tester. Currently, beta testers are selected by hand. "
        ]
    ]

    let content = [];

    for (let i = 0; i < faqs.length; i++) {
        const element = faqs[i];
        content.push(<div key={i} id={"h" + i}>
            <h2>{element[0]}</h2>
            <p dangerouslySetInnerHTML={{ __html: element[1] }}></p>
        </div>)
    }

    document.title = "Frequently Asked Questions | League of Legends Challenge Tracker"

    if (window.location.hash !== "") {
        setTimeout(() => {
            if (document.getElementById(window.location.hash.substring(1))) {
                document.getElementById(window.location.hash.substring(1)).scrollIntoView({ behavior: "smooth", block: "center" })
                document.getElementById(window.location.hash.substring(1)).style.borderColor = "white"
            }
        }, 50)
    }

    return <div className={"object1000 faq CHALLENGER"}>
        <h1>Frequently Asked Questions (FAQ)</h1>
        {content}
    </div>
}
