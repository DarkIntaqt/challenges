import React from "react"
import StyleSheet from "./css/start.module.css"
import { Navigate } from "react-router-dom";

export default class Start extends React.Component {
  constructor(props) {
    super(props)
    this.state = { search: false, to: "/" };
    this.goTo = this.goTo.bind(this);
  }

  goTo(loc) {
    this.setState({ to: loc, search: true });
  }

  componentDidMount() {
    let elements = document.querySelectorAll("." + StyleSheet.region);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].innerText === window.region) {
        elements[i].classList.add(StyleSheet.selected)
      }
    }

    let goTo = this.goTo;

    let searchbar = document.getElementById("search");
    searchbar.addEventListener("keyup", function (e) {
      if (e.code === "Enter") {
        goTo("/" + window.region + "/" + e.target.value.replaceAll(" ", "").toLowerCase())
      }
    })
    let enter = document.getElementById("search-submit");
    enter.addEventListener("click", function () {
      goTo("/" + window.region + "/" + searchbar.value.replaceAll(" ", "").toLowerCase())
    })

  }
  render() {
    document.title = "League of Legends Challenge Progress Lookup & Tracker"
    const img = [
      131, 4, 2,
      254, 4, 29,
      38, 4, 14,
      43, 4, 7,
      2, 4, 25,
      432, 4, 8,
      104, 4, 5,
      53, 6, 6,
      55, 4, 10,
      60, 4, 6,
      99, 4, 29,
      150, 4, 3
    ];
    const backgroundImage = {
      background: 'center no-repeat url("https://lolcdn.darkintaqt.com/s/e-' + ((img[new Date().getMonth() * 3]) * 7).toString(16) + "-" + (img[new Date().getMonth() * 3] * (img[new Date().getMonth() * 3 + 1])).toString(16) + "-" + img[new Date().getMonth() * 3 + 2] + '")',
      backgroundSize: 'cover'
    };

    function changeRegion(e) {
      window.region = e.target.innerText;
      document.cookie = "_Cregion=" + window.region + ";Secure"
      let selected = document.querySelectorAll("." + StyleSheet.region + "." + StyleSheet.selected);
      for (let i = 0; i < selected.length; i++) {
        selected[i].classList.remove(StyleSheet.selected)
      }
      let elements = document.querySelectorAll("." + StyleSheet.region);
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].innerText === window.region) {
          elements[i].classList.add(StyleSheet.selected)
        }
      }
    }

    return <React.Fragment>
      <div className={StyleSheet.background} style={backgroundImage}></div>
      <div className={StyleSheet.start + " object1000"}>
        <h1>League of Legends <br /><span>Challenge Progress Lookup</span></h1>
        <h2>By <a href="https://darkintaqt.com/blog/c-en/leagueoflegendsapi/" target="_blank" rel="noreferrer">DarkIntaqt.com</a></h2>
        <div className={StyleSheet.searchbar}>
          <i className={"fa-solid fa-magnifying-glass"} id="search-submit"></i>
          <input type="text" id="search" placeholder="Enter summoner name to look up challenges" />
        </div>
        {this.state.search && (<Navigate to={this.state.to} replace={true} />)}
        <div className={StyleSheet.serverselector}>
          <div className={StyleSheet.region} onClick={changeRegion} >br</div>
          <div className={StyleSheet.region} onClick={changeRegion}>euw</div>
          <div className={StyleSheet.region} onClick={changeRegion}>eune</div>
          <div className={StyleSheet.region} onClick={changeRegion}>jp</div>
          <div className={StyleSheet.region} onClick={changeRegion}>kr</div>
          <div className={StyleSheet.region} onClick={changeRegion}>lan</div>
          <div className={StyleSheet.region} onClick={changeRegion}>las</div>
          <div className={StyleSheet.region} onClick={changeRegion}>na</div>
          <div className={StyleSheet.region} onClick={changeRegion}>oc</div>
          <div className={StyleSheet.region} onClick={changeRegion}>tr</div>
        </div>
      </div>
    </React.Fragment>
  }
}