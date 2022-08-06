import { Component } from "react";
import css from "../css/titles.module.css"
import { Navigate } from "react-router-dom"
import get from "../func/get"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import goTo from "../func/goTo.js";

export default class Title extends Component {
    constructor(props) {
        super(props);
        this.showUser = this.showUser.bind(this);
        this.error = this.error.bind(this);
        this.state = {
            heading: "All titles",
            titles: [

            ],
            location: ""
        }
    }

    componentDidMount() {
        this.load()
    }

    load() {

        get(`https://challenges.darkintaqt.com/api/v1/titles/`, this.showUser, this.error);
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

        let titles = [];

        for (let i = 0; i < this.state.titles.length; i++) {
            const element = this.state.titles[i];

            titles.push(<a href={"/challenge/" + element.cid} className={css.title + " " + element.type + " clearfix"} key={element.cid} challengeid={element.cid} onClick={goTo}>
                <LazyLoadImage height={45} width={45} src={"https://lolcdn.darkintaqt.com/s/C-" + element.icon + "-" + element.type.toLowerCase()} placeholderSrc={"https://cdn.darkintaqt.com/lol/static/missing/item.png"} alt="" />
                <p>Achieved by {element.percentile}% of all players</p>
                <h2>{element.title}</h2>
                <p>Reach <span>{element.type} tier</span> in <span>"{element.challenge}"</span>. <br></br>{element.description}<br /><br /><i>Need {element.threshold}.</i></p>
            </a>)
        }


        if (titles.length === 0) {
            titles = <p className={css.loading}>Loading...</p>
        }

        return <div className={"object1000"}>
            <h1 className={css.heading}>{this.state.heading}</h1>
            <div className={css.titles}>
                {titles}
            </div>
            {this.state.location}
            <p className={css.disclaimer}>'Challenges.DarkIntaqt.Com' isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
        </div>
    }
}