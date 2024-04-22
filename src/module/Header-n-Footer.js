import { Outlet, Link } from "react-router-dom";
import { Fragment } from "react"
import StyleSheet from "../css/header.module.css";
import logo from "../img/logo.svg";
import { useTranslation } from "react-i18next";
import css from "../css/footer.module.scss"

export default function HeaderNFooter() {

    const { t } = useTranslation()

    return <Fragment>
        <nav className={StyleSheet.Header}>
            <div className={StyleSheet.inner}>
                <Link to="/">
                    <img src={logo} alt="League of Legends Challenge Tracker Logo" />
                    Challenge Tracker
                </Link>

                <Link to="/community" className={StyleSheet.hideOnMobile}>
                    <i className="fa-solid fa-user-group"></i> {t("Community")}
                </Link>

                <Link to="/settings">
                    <i className="fa-solid fa-globe"></i>
                </Link>

                <Link to="/challenges">
                    <i className="fa-solid fa-compass"></i> {t("Challenges")}
                </Link>

                <Link to="/challenge/0" className={StyleSheet.hideOnMobile}>
                    <i className="fa-solid fa-ranking-star"></i> {t("Leaderboards")}
                </Link>

                <Link to="/titles">
                    <i className="fa-solid fa-award"></i> {t("Titles")}
                </Link>
            </div>
        </nav>

        <div className={StyleSheet.HeaderPlaceholder} id="top"></div>

        <div className={StyleSheet.content}>
            <Outlet></Outlet>
        </div>


        <div className={css.footer} data-nosnippet>

            <div className={css.top}>

                <div className={`${css.linkgroup} ${css.special}`}>

                    <img src={logo} alt="Challenges Tracker logo" width={128} height={128}></img>
                    <p>&copy;2022 - {new Date().getFullYear()}</p>
                    <p>Challenge Tracker</p>

                    <p>Made with <i className="fa-solid fa-heart"
                    /> by <a href="https://darkintaqt.com" target="_blank" rel="noreferrer">DarkIntaqt</a>
                        <br />
                        and <a href="https://github.com/DarkIntaqt/challenges/graphs/contributors" target="_blank" rel="noreferrer">contributors</a>.
                    </p>

                </div>

                <div className={css.linkgroup}>
                    <p>Challenge Tracker</p>

                    <Link to="/titles">Titles</Link>
                    <Link to="/challenges">Challenges</Link>
                    <Link to="/challenge/0">Challenge Leaderboard</Link>
                    <a href="https://darkintaqt.com/blog/about-challenge-tracker" target="_blank" rel="noreferrer">About</a>
                    <a href="https://darkintaqt.com/blog/about-challenge-tracker#faq" target="_blank" rel="noreferrer">Help & FAQ</a>
                </div>

                <div className={css.linkgroup}>
                    <p>Social</p>

                    <a href="https://twitter.com/darkintaqt" target="_blank" rel="noreferrer">Twitter</a>
                    <Link to="/community">Community</Link>
                    <a href="https://github.com/DarkIntaqt/challenges" target="_blank" rel="noreferrer">Contribute on GitHub</a>
                </div>

                <div className={css.linkgroup}>
                    <p>Resources</p>

                    <a href="https://darkintaqt.com/imprint" target="_blank" rel="noreferrer">Imprint</a>
                    <a href="https://challenges.darkintaqt.com/tos" target="_blank" rel="noreferrer">Terms of Service</a>
                    <a href="https://challenges.darkintaqt.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
                </div>

            </div>

            <div className={css.bot}>

                <p>
                    &apos;Challenges.DarkIntaqt.Com&apos; isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
                </p>

            </div>

        </div>

    </Fragment >
}
