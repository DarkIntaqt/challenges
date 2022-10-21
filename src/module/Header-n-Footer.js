import { Outlet, Link } from "react-router-dom";
import { Fragment } from "react"
import StyleSheet from "../css/header.module.css";
import logo from "../img/logo.png";
import Ad from "./Ad"

export default function HeaderNFooter() {

    return <Fragment>
        <nav className={StyleSheet.Header}>
            <div className={StyleSheet.inner}>
                <Link to="/">
                    <img src={logo} alt="League of Legends Challenge Tracker Logo" />
                    Challenge Tracker
                </Link>

                <Link to="/community" className={StyleSheet.hideOnMobile}>
                    <i className="fa-solid fa-user-group"></i> Community <span>NEW</span>
                </Link>

                <Link to="/challenges">
                    <i className="fa-solid fa-list"></i> Challenges
                </Link>

                <Link to="/challenge/0" className={StyleSheet.hideOnMobile}>
                    <i className="fa-solid fa-ranking-star"></i> Leaderboards
                </Link>

                <Link to="/titles">
                    <i className="fa-solid fa-award"></i> Titles
                </Link>
            </div>
        </nav>

        <div className={StyleSheet.HeaderPlaceholder} id="top"></div>

        <div className={StyleSheet.content}>
            <Outlet></Outlet>
            <Ad placeholder="false"></Ad>
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
                    <p>'Challenges.DarkIntaqt.Com' isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.<br /><br />Huge thanks to <a href="https://www.communitydragon.org" target="_blank" rel="noreferrer">CommunityDragon</a> for hosting the assets. </p>
                </div>
                <div className={StyleSheet.rightFooter}>
                    <a href="https://darkintaqt.com/assets/impressum/" rel="noreferrer" target="_blank">Imprint</a>
                    <a href="https://darkintaqt.com/assets/privacypolicy/" rel="noreferrer" target="_blank">Privacy Policy</a>
                    <Link to={"/faq"}>FAQ</Link>
                    <a href="https://github.com/DarkIntaqt/challenges" target="_blank" rel="noreferrer">GitHub</a>
                </div>
            </div>
        </footer>

    </Fragment >
}
