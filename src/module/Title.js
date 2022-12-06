import { Component } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { withTranslation } from "react-i18next";

import get from "../func/get"
import goTo from "../func/goTo.js";

import css from "../css/titles.module.css"
import Wrapper from "./Wrapper";
import Error from "./Error";


class Title extends Component {
    constructor(props) {
        super(props);
        this.showUser = this.showUser.bind(this);
        this.error = this.error.bind(this);
        this.state = {
            titles: [

            ],
            translation: props.t
        }
    }

    componentDidMount() {
        this.load()
    }

    load() {

        get(`https://challenges.darkintaqt.com/api/v2/t/`, this.showUser, this.error);

    }

    showUser(r) {
        document.title = "All Challenge Titles - Overview"
        this.setState({
            titles: r
        });

    }

    error() {
        console.error("Error");
    }

    render() {
        const t = this.state.translation
        if (document.location.pathname.slice(-1) === "/") {
            return <Error></Error>
        }

        let titles = [];

        for (let i = 0; i < this.state.titles.length; i++) {
            const element = this.state.titles[i];

            titles.push(<a href={"/challenge/" + element.cid} className={css.title + " " + element.type + " clearfix"} key={element.cid} challengeid={element.cid} onClick={goTo}>
                <LazyLoadImage height={45} width={45} src={"https://lolcdn.darkintaqt.com/cdn/np-token/" + element.icon + "/" + element.type.toLowerCase()} placeholderSrc={"https://cdn.darkintaqt.com/lol/static/missing/item.png"} alt={element.title + "'s icon"} />
                <h2>{element.title}<br /><span data-nosnippet>{element.percentile}%</span></h2>
                <p>{t("Reach {{tier}} tier in \"{{challenge}}\"", { tier: element.type, challenge: element.challenge })}<br></br>{element.description}<br /><br /><i>{t("Need {{p}}", { p: element.threshold })}</i></p>

            </a>)
        }


        if (titles.length === 0) {
            titles = <p className={css.loading}>Loading...</p>
        }

        return <Wrapper className={"object1000"}>

            <h1 className={css.heading}>{t("All titles")}</h1>
            <p className={css.subheading}>{t("A list of all League of Legends Title Challenges and how to achieve them")}</p>

            <div className={css.titles}>
                {titles}
            </div>
        </Wrapper>
    }
}

export default withTranslation()(Title)