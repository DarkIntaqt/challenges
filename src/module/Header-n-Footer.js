import { Outlet, Link } from "react-router-dom";
import { Fragment } from "react"
import StyleSheet from "../css/header.module.css";
import logo from "../img/logo.svg";
import { useTranslation } from "react-i18next";

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


        <footer className={StyleSheet.footer}>
            <div className={"object1000"}>
                <div className={StyleSheet.leftFooter}>
                    <Link to={"/"}>
                        <img src={logo} alt="Logo" width={50} height={50}></img>
                        <p>LoL Challenge Tracker</p>
                    </Link>
                </div>
                <div className={StyleSheet.centerFooter} data-nosnippet>
                    <p>
                        'Challenges.DarkIntaqt.Com' isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
                        <br />
                        <br />
                        &copy; 2022 - 2023 challenges.darkintaqt.com
                    </p>
                    <p dangerouslySetInnerHTML={
                        {
                            __html: t("Thanks to {{cdragon}} for serving the assets", { cdragon: '<a href="https://www.communitydragon.org" target="_blank" rel="noreferrer">CommunityDragon</a>' })
                        }
                    }></p>

                </div>
                <div className={StyleSheet.rightFooter}>
                    <a href="https://darkintaqt.com/imprint" rel="noreferrer" target="_blank">Imprint</a>
                    <a href="/privacy" rel="noreferrer" target="_blank">Privacy Policy</a>
                    <a href="/tos" rel="noreferrer" target="_blank">Terms of Service</a>
                    <a href={"https://darkintaqt.com/blog/about-challenge-tracker#faq"} target="_blank" rel="noreferrer">{t("FAQ")}</a>
                    <a href="https://github.com/DarkIntaqt/challenges" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://twitter.com/darkintaqt" target="_blank" rel="noreferrer">Twitter</a>
                </div>
            </div>
        </footer>

    </Fragment >
}
