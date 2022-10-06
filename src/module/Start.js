import React, { Component, Fragment } from "react"
import StyleSheet from "../css/start.module.css"

import config from "../config";
import { LazyLoadImage } from "react-lazy-load-image-component";

import goTo from "../func/goTo";

export default class Start extends Component {

  constructor(params) {
    super(params)
    this.toggleRecent = this.toggleRecent.bind(this)

    this.state = { display: "none" }
  }

  componentDidMount() {


    // Color the selected region
    let elements = document.querySelectorAll("." + StyleSheet.region);
    for (let i = 0; i < elements.length; i++) {

      if (elements[i].innerText === window.region) {

        elements[i].classList.add(StyleSheet.selected)

      }

    }


    function search(name) {

      window.reactNavigate("/" + window.region + "/" + name)

    }

    let self = this
    // post username-input if pressed enter
    let searchbar = document.getElementById("search");
    searchbar.addEventListener("keyup", function (clickEvent) {

      if (clickEvent.target.value.length > 0 && self.state.display === "block") {
        self.setState({ display: "none" })
      }

      if (clickEvent.target.value.length === 0 && self.state.display === "none") {
        self.setState({ display: "block" })
      }

      if (clickEvent.code === "Enter") {

        search(clickEvent.target.value)

      }

    })


    // post username-input if press on "search"
    let enter = document.getElementById("search-submit");
    enter.addEventListener("click", function () {

      search(searchbar.value)

    })

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


  render() {

    document.title = "League of Legends Challenge Tracker and Progress Lookup"


    const img = config.startScreenImages

    const backgroundImage = {
      background: 'center no-repeat url("https://lolcdn.darkintaqt.com/s/e-' + ((img[new Date().getMonth() * 3]) * 7).toString(16) + "-" + (img[new Date().getMonth() * 3] * (img[new Date().getMonth() * 3 + 1])).toString(16) + "-" + img[new Date().getMonth() * 3 + 2] + '")',
      backgroundSize: 'cover'
    };


    function changeRegion(e) {
      window.region = e.target.innerText;

      let date = new Date();
      date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
      const expires = date.toUTCString();

      document.cookie = "_Cregion=" + window.region + ";expires=" + expires + ";path=/;Secure"

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
              <LazyLoadImage src={"https://lolcdn.darkintaqt.com/cdn/profileicon/" + val[2]} placeholderSrc={"https://lolcdn.darkintaqt.com/cdn/profileicon/29"} width={26} height={26} />
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
      <div className={StyleSheet.background} style={backgroundImage}></div>
      <div className={StyleSheet.start + " object1000"}>
        <h1>League of Legends <br /><span>Challenge Progress Tracker</span></h1>
        <h2>By <a href="https://darkintaqt.com/blog/c-en/leagueoflegendsapi/" target="_blank" rel="noreferrer">DarkIntaqt.com</a></h2>

        <div className={StyleSheet.searchbar}>
          <i className={"fa-solid fa-magnifying-glass"} id="search-submit"></i>
          <input type="text" id="search" placeholder="Enter summoner name to look up challenges" onFocus={this.toggleRecent} onBlur={this.toggleRecent} autoComplete="off" />
          <div className={StyleSheet.recentlySearched} id={StyleSheet.recentlySearched} style={{ display: this.state.display }}>
            {recentlySearchedFor}
          </div>
        </div>

        <div className={StyleSheet.serverselector}>
          <div className={StyleSheet.region} onClick={changeRegion}>br</div>
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
    </Fragment>
  }
}