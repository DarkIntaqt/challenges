import { Component } from "react";
import Error from "./Error"
import { Navigate } from "react-router-dom"
import "./css/user.css"

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
            filter: this.filter,
            name: <div className={"loading"} style={{
                width: 20 * 1.4 + "rem", height: "2rem"
            }}></div>,
            thresholds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            type: "UNRANKED",
            title: "",
            profileImage: "https://cdn.darkintaqt.com/lol/static/missing/item.png",
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
            profileImage: "https://lolcdn.darkintaqt.com/s/C-" + r.icon,
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
        get(`https://challenges.darkintaqt.com/api/v1/challenges/?id=${this.params.id}&region=${this.filter}`, this.showUser, this.error);
    }
    componentDidMount() {
        document.title = "Loading..."
        this.load()
    }

    goTo(e) {
        e.preventDefault();
        let loc = new URL(e.currentTarget.href);
        loc = loc["pathname"] + loc["search"];
        console.log(loc)
        this.setState({ challenges: <Navigate to={loc} replace={true}></Navigate> })
    }

    changeFilter(e) {
        this.filter = e.target.id;
        this.setState({ filter: e.target.id, challenges: this.loadingUI });
        if (this.filter === "world") {
            window.history.replaceState({}, "", "?")
        } else {
            window.history.replaceState({}, "", "?region=" + e.target.id)
        } this.load();
    }

    render() {
        console.log(this.params)
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
                <img src={this.state.profileImage} alt="" style={{ borderRadius: "50%" }} />
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
                <button onClick={this.changeFilter} id="world">Global</button>
                <button onClick={this.changeFilter} id="br">br</button>
                <button onClick={this.changeFilter} id="euw">euw</button>
                <button onClick={this.changeFilter} id="eune">eune</button>
                <button onClick={this.changeFilter} id="jp">jp</button>
                <button onClick={this.changeFilter} id="kr">kr</button>
                <button onClick={this.changeFilter} id="lan">lan</button>
                <button onClick={this.changeFilter} id="las">las</button>
                <button onClick={this.changeFilter} id="na">na</button>
                <button onClick={this.changeFilter} id="oc">oc</button>
                <button onClick={this.changeFilter} id="tr">tr</button>
            </div>
            {this.state.challenges}
        </div>
    }
}