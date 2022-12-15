import { Outlet, Link } from "react-router-dom";
import { Component, Fragment } from "react"
import StyleSheet from "../css/header.module.css";
import logo from "../img/logo.png";

import { withTranslation } from 'react-i18next';

import goTo from "../func/goTo";
import { LazyLoadImage } from "react-lazy-load-image-component";

class HeaderNFooter extends Component {
    constructor(params) {
        super(params)
        this.toggleRecent = this.toggleRecent.bind(this)



        this.state = { display: "none", translation: params.t }
    }
    toggleRecent(e) {

        try {

            if (e.type === "blur") {

                this.setState({ display: "none" })

            } else {

                this.setState({ display: "block" })

            }

        } catch (error) {

            console.error(error);

        }

    }

    componentDidMount() {
        function search(name) {

            window.reactNavigate("/" + window.region + "/" + name)

        }


        let self = this
        // post username-input if pressed enter
        let searchbar = document.getElementById("search-top");

        searchbar.addEventListener("keyup", function (clickEvent) {

            if (clickEvent.target.value.length > 0 && self.state.display === "block") {
                self.setState({ display: "none" })
            }

            if (clickEvent.target.value.length === 0 && self.state.display === "none") {
                self.setState({ display: "block" })
            }

            if (clickEvent.code === "Enter") {

                searchbar.blur()
                search(clickEvent.target.value)

            }

        })


    }

    render() {

        const t = this.state.translation

        const recentlySearchedList = localStorage.getItem("_search")

        let recentlySearchedFor = []

        if (recentlySearchedList !== null) {
            let parsedList = false
            try {
                parsedList = JSON.parse(recentlySearchedList)
            } catch (error) {
                console.error(error);
            } finally {

                if (parsedList !== false) {

                    recentlySearchedFor = parsedList.map((val) => {
                        return <a key={JSON.stringify(val)} href={"/" + val[0] + "/" + val[1]} className={StyleSheet.searchedUser} onClick={goTo}>
                            <LazyLoadImage src={"https://lolcdn.darkintaqt.com/cdn/profileicon/" + val[2]} placeholderSrc={"https://lolcdn.darkintaqt.com/cdn/profileicon/29"} width={20} height={20} />
                            <p>
                                {val[1]}
                                <span className={StyleSheet.userRegion}>#{val[0]}</span>
                            </p>
                        </a>
                    })

                }

            }
        }

        return <Fragment>
            <nav className={StyleSheet.header} >
                <div className={StyleSheet.inner}>
                    <Link to="/">
                        <img src={logo} alt="League of Legends Challenge Tracker Logo" />
                        <span className={`m-hide`}>{t("Challenge Tracker")}</span>
                    </Link>

                    <div className={StyleSheet.searchbar}>
                        <input type="text" id="search-top" placeholder="Search summoner" onFocus={this.toggleRecent} onBlur={this.toggleRecent} autoComplete="off" />

                        <select>
                            <option value="br">BR</option>
                            <option value="euw">EUW</option>
                            <option value="eune">EUNE</option>
                            <option value="jp">JP</option>
                            <option value="kr">KR</option>
                            <option value="lan">LAN</option>
                            <option value="las">LAS</option>
                            <option value="na">NA</option>
                            <option value="oc">OC</option>
                            <option value="ru">RU</option>
                            <option value="tr">TR</option>
                        </select>

                        <i className={"fa-solid fa-magnifying-glass"} id="search-submit-top"></i>
                        <div className={StyleSheet.recentlySearched} id={StyleSheet.recentlySearched} style={{ display: this.state.display }}>
                            {recentlySearchedFor}
                        </div>
                    </div>

                    <Link to="/community" className={StyleSheet.hideOnMobile + " " + StyleSheet.left}>
                        <i className="fa-solid fa-user-group"></i>
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
                        <p>'Challenges.DarkIntaqt.Com' isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
                            <br />
                            <br />
                            &copy; 2022 - challenges.darkintaqt.com</p>
                        <br />
                        <p dangerouslySetInnerHTML={
                            {
                                __html: t("Thanks to {{cdragon}} for serving the assets", { cdragon: '<a href="https://www.communitydragon.org" target="_blank" rel="noreferrer">CommunityDragon</a>' })
                            }
                        }></p>
                    </div>
                    <div className={StyleSheet.rightFooter}>
                        <a href="https://darkintaqt.com/assets/impressum/" rel="noreferrer" target="_blank">Imprint</a>
                        <a href="https://darkintaqt.com/assets/privacypolicy/" rel="noreferrer" target="_blank">Privacy Policy</a>
                        <Link to={"/faq"}>{t("FAQ")}</Link>
                        <a href="https://github.com/DarkIntaqt/challenges" target="_blank" rel="noreferrer">GitHub</a>
                        <a href="https://twitter.com/darkintaqt" target="_blank" rel="noreferrer">Twitter</a>
                    </div>
                </div>
            </footer>

        </Fragment>
    }
}

export default withTranslation()(HeaderNFooter)