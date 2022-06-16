import { Component } from "react";
import Error from "./Error"
import { Navigate } from "react-router-dom"
import "./css/user.css"

export default class User extends Component {
    constructor(props) {
        super(props);
        this.filter = "level"
        this.params = props.params;
        this.showUser = this.showUser.bind(this);
        this.error = this.error.bind(this);
        this.goTo = this.goTo.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.loadingUI = <section>
            <div>
                <div className="challengeMain">
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                    <a className="challenge UNRANKED loading" href="#loading"><p className="title">Loading<span>Loading</span></p><p className="description">Loading</p></a>
                </div>
            </div>
        </section>;
        this.state = {
            extraStyle: { display: "block" },
            alphabet: "a-z",
            points: ["0", "1"],
            selections: {
                "img1": "https://cdn.darkintaqt.com/lol/static/missing/item.png",
                "img2": "https://cdn.darkintaqt.com/lol/static/missing/item.png",
                "img3": "https://cdn.darkintaqt.com/lol/static/missing/item.png",
                "statsl": { "tier": "UNRANKED", "challenge": ["...", "..."] },
                "statsm": { "tier": "UNRANKED", "challenge": ["...", "..."] },
                "statsr": { "tier": "UNRANKED", "challenge": ["...", "..."] }
            },
            filter: this.filter,
            name: <div className={"loading"} style={{
                width: props.params.user.length * 1.4 + "rem", height: "2rem"
            }}></div>,
            type: "UNRANKED",
            title: "",
            profileImage: "https://cdn.darkintaqt.com/lol/static/missing/item.png",
            challenges: this.loadingUI
        }
    }

    showUser(r) {
        document.title = r.name + "'s Challenge Progress Overview"
        let djs = new window.DJS();
        let tempObject = document.createElement("div");
        djs.render(r.challenges, tempObject, true);
        this.setState({
            found: true,
            type: r.type,
            title: r.title,
            points: r.points,
            name: r.name,
            selections: {
                "img1": "https://lolcdn.darkintaqt.com/s/C-" + r.selections["left"]["id"],
                "img2": "https://lolcdn.darkintaqt.com/s/C-" + r.selections["middle"]["id"],
                "img3": "https://lolcdn.darkintaqt.com/s/C-" + r.selections["right"]["id"],
                "statsl": r.selections["left"],
                "statsm": r.selections["middle"],
                "statsr": r.selections["right"],
            },
            profileImage: "https://lolcdn.darkintaqt.com/s/p-" + r.icon,
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
    load() {
        const get = async function (url = "/", callback = function (r) {
            console.log(r)
        }, errorCallback = function (e) {
            console.warn(e)
        }, debug = false) {
            let request = await fetch(url)
            if (debug) {
                console.log(request);
            }
            if (request.status === 200) {
                let result = await request.text();
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    if (debug) {
                        console.warn(e + " in get(" + url + ")");
                    }
                } finally {
                    if (debug) {
                        console.log(result);
                    }
                    callback(result);
                }

            } else {
                errorCallback(request.status);
            }
        }

        get(`https://challenges.darkintaqt.com/api/v1/summoner/?name=${this.params.user}&server=${this.params.server}&order-by=${this.filter}`, this.showUser, this.error);
    }
    componentDidMount() {
        document.title = "Loading..."
        this.load()
    }

    goTo(e) {
        e.preventDefault();
        let loc = new URL(e.currentTarget.href);
        loc = loc["pathname"] + loc["search"];
        this.setState({ challenges: <Navigate to={loc} replace={false}></Navigate> })
    }

    changeFilter(e) {
        this.filter = e.target.id;
        this.setState({ filter: e.target.id, challenges: this.loadingUI });
        this.load()
    }

    render() {
        if (this.filter === "alphabetic-a-z" && this.state.alphabet === "a-z") {
            this.setState({ alphabet: "z-a" })
        }
        if (this.filter === "alphabetic-z-a" && this.state.alphabet === "z-a") {
            this.setState({ alphabet: "a-z" })
        }
        if (this.state.found) {
            setTimeout(() => {
                let links = document.querySelectorAll(".challengeMain>a");
                for (let i = 0; i < links.length; i++) {
                    const element = links[i];
                    //const url = element.href;
                    element.addEventListener("click", this.goTo)

                }
            }, 10);
        }

        return <div className="user object1000">
            <div className={this.state.type + " profile"} style={this.state.extraStyle}>
                <img src={this.state.profileImage} alt="" />
                <h1>{this.state.name}</h1>
                <h2 className={this.state.title["tier"]}><span dangerouslySetInnerHTML={{ __html: this.state.title["title"] }}></span><div><b>{this.state.title["tier"]} Tier Title</b><br />{this.state.title["description"]}<br /><i>Need {this.state.title["threshold"]}</i></div></h2>
                <div className="selections">
                    <div style={{ backgroundImage: "url('" + this.state.selections["img1"] + "')" }}>
                        <div className={this.state.selections["statsl"]["tier"]}><b>{this.state.selections["statsl"]["tier"]} Tier Token</b><br />{this.state.selections["statsl"]["challenge"][0]}<br /><i>Need {this.state.selections["statsl"]["challenge"][1]}.</i></div>
                    </div>
                    <div style={{ backgroundImage: "url('" + this.state.selections["img2"] + "')" }} >
                        <div className={this.state.selections["statsm"]["tier"]}><b>{this.state.selections["statsm"]["tier"]} Tier Token</b><br />{this.state.selections["statsm"]["challenge"][0]}<br /><i>Need {this.state.selections["statsm"]["challenge"][1]}.</i></div>
                    </div>
                    <div style={{ backgroundImage: "url('" + this.state.selections["img3"] + "')" }} >
                        <div className={this.state.selections["statsr"]["tier"]}><b>{this.state.selections["statsr"]["tier"]} Tier Token</b><br />{this.state.selections["statsr"]["challenge"][0]}<br /><i>Need {this.state.selections["statsr"]["challenge"][1]}.</i></div>
                    </div>
                </div>
            </div>
            <div className={this.state.type + " personalProgress"} style={this.state.extraStyle}>
                <span class={"progressText"}>{this.state.points[0]}/{this.state.points[1]}</span>
                <div className={"progress"}>
                    <div className={"indicator"} style={{ width: "calc(102px * " + (parseInt(this.state.points[0].replaceAll(".", ""))) / (parseInt(this.state.points[1].replaceAll(".", ""))) }}></div>
                </div>
            </div>
            <div className={"filter " + this.state.filter} style={this.state.extraStyle}>
                <button onClick={this.changeFilter} id="level">Rank</button>
                <button onClick={this.changeFilter} id="timestamp">Last updated</button>
                <button onClick={this.changeFilter} id="percentile">Leaderboard Position</button>
                <button onClick={this.changeFilter} id="levelup">Levelup</button>
                <button onClick={this.changeFilter} id={"alphabetic-" + this.state.alphabet}>{this.state.alphabet.toUpperCase()}</button>
            </div>
            {this.state.challenges}
        </div>
    }
}