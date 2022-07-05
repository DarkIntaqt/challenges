import { Component } from "react";
import Error from "./Error"
import { Navigate } from "react-router-dom"
import "./css/user.css"
import get from "./get"

export default class Challenge extends Component {
    constructor(props) {
        super(props);
        this.filter = "world"
        this.params = props.params;
        if (props.query !== "") {
            this.filter = props.query
        }
        this.showUser = this.showUser.bind(this);
        this.error = this.error.bind(this);
        this.goTo = this.goTo.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.loadingUI = window.loadingUI;
        this.state = {
            extraStyle: { display: "block" },
            filter: this.filter,
            name: <div className={"loading"} style={{
                width: 20 * 1.4 + "rem", height: "2rem"
            }}></div>,
            thresholds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            type: "UNRANKED",
            title: "",
            icon: "https://cdn.darkintaqt.com/lol/static/missing/item.png",
            challenges: this.loadingUI
        }
    }

    showUser(r) {
        document.title = r.name + " Challenge Overview, Thresholds and Leaderboards"
        let djs = new window.DJS();
        let tempObject = document.createElement("div");
        djs.render(r.challenge, tempObject, true);
        this.setState({
            found: true,
            type: r.type,
            name: r.name,
            thresholds: r.thresholds,
            title: r.title,
            icon: "https://lolcdn.darkintaqt.com/s/C-" + r.icon,
            challenges:
                <section dangerouslySetInnerHTML={{ __html: tempObject.outerHTML }} />
        });

    }

    error() {
        this.setState({
            challenges: <Error></Error>,
            extraStyle: { display: "none" }
        })
    }

    componentDidMount() {
        document.title = "Loading..."
        get(`https://challenges.darkintaqt.com/api/v1/challenges/?id=${this.params.id}&region=${this.filter}`, this.showUser, this.error);
    }

    goTo(e) {
        e.preventDefault();
        let loc = new URL(e.currentTarget.href);
        this.setState({ challenges: <Navigate to={loc["pathname"] + loc["search"]} replace={true}></Navigate> })
    }

    changeFilter(e) {
        this.filter = e.target.id;
        this.setState({ filter: e.target.id, challenges: this.loadingUI });
        if (this.filter === "world") {
            window.history.replaceState({}, "", "?")
        } else {
            window.history.replaceState({}, "", "?region=" + e.target.id)
        }
        get(`https://challenges.darkintaqt.com/api/v1/challenges/?id=${this.params.id}&region=${this.filter}`, this.showUser, this.error);
    }

    render() {
        if (this.state.found) {
            setTimeout(() => {
                let links = document.querySelectorAll(".challengeMain>a");
                for (let i = 0; i < links.length; i++) {
                    links[i].addEventListener("click", this.goTo)
                }
            }, 10);
            // Wait for render to finish before applying event listener
        }

        const regions = ["br", "euw", "eune", "jp", "kr", "lan", "las", "na", "oc", "tr"];
        let filters = [<button key={"world"} onClick={this.changeFilter} id="world">Global</button>];
        for (let i = 0; i < regions.length; i++) {
            filters.push(<button key={i} onClick={this.changeFilter} id={regions[i]}>{regions[i]}</button>)
        }

        return <div className="user object1000 cc">
            <div className={this.state.type + " c profile"} style={this.state.extraStyle}>
                <img src={this.state.icon} alt="" />
                <h1>{this.state.name}</h1>
                <h2 className={this.state.title["tier"]}><span dangerouslySetInnerHTML={{ __html: this.state.title["title"] }} style={{ cursor: "pointer" }}></span></h2>
                <div className={"thresholds"}>
                    <div className={"IRON"}><i className="fa-solid fa-circle"></i>{this.state.thresholds[1]}</div>
                    <div className={"BRONZE"}><i className="fa-solid fa-circle"></i>{this.state.thresholds[2]}</div>
                    <div className={"SILVER"}><i className="fa-solid fa-circle"></i>{this.state.thresholds[3]}</div>
                    <div className={"GOLD"}><i className="fa-solid fa-circle"></i>{this.state.thresholds[4]}</div>
                    <div className={"PLATINUM"}><i className="fa-solid fa-circle"></i>{this.state.thresholds[5]}</div>
                    <div className={"DIAMOND"}><i className="fa-solid fa-circle"></i>{this.state.thresholds[6]}</div>
                    <div className={"MASTER"}><i className="fa-solid fa-circle"></i>{this.state.thresholds[7]}</div>
                    <div className={"GRANDMASTER"}><i className="fa-solid fa-circle"></i>{this.state.thresholds[8]}</div>
                    <div className={"CHALLENGER"}><i className="fa-solid fa-circle"></i>{this.state.thresholds[9]}</div>
                </div>
            </div>
            <div className={"filter " + this.state.filter} style={this.state.extraStyle}>
                {filters}
            </div>
            {this.state.challenges}
        </div>
    }
}