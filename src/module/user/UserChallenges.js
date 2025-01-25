import { Component, Fragment } from "react";
import config from "../../config";
import filterCSS from "../../css/filter.module.css";

import { setCookie } from "../../func/cookiefunctions";
import { toggleValue } from "../../func/arrayManipulationFunctions.js";

import ChallengeObject from "../ChallengeObject";
import challengeCSS from "../../css/challengeObject.module.css";

import { beautifyNum } from "../../func/beautify.js";
import { checkExists } from "../../func/arrayManipulationFunctions.js";

import { intToTier } from "../../func/tierFunctions";

import Timestamp from "react-timestamps";

import css from "../../css/user.module.css";

import orderChallenges, { getNextLevel } from "./orderChallenges";
import Loader from "../Loader";
import { withTranslation } from "react-i18next";
import { capitalize } from "../../func/stringManipulation";
import getChallenge from "../../func/getChallenge";
import {
  getStorage,
  setStorage,
  storageKeys,
} from "../../func/sessionStorageFunctions";

class UserChallenges extends Component {
  constructor(props) {
    super(props);

    this.changeFilter = this.changeFilter.bind(this);
    this.changeExtraFilter = this.changeExtraFilter.bind(this);
    this.toggleMasterTierSorting = this.toggleMasterTierSorting.bind(this);
    this.togglePointsAvailableSorting =
      this.togglePointsAvailableSorting.bind(this);
    this.toggleCapstones = this.toggleCapstones.bind(this);

    this.changeDisplayMethod = this.changeDisplayMethod.bind(this);
    this.search = this.search.bind(this);

    this.props = props;

    const filter = getStorage(storageKeys.userFilter, "level");
    const alphabet = filter === "alphabetic-a-z" ? "z-a" : "a-z";

    this.state = {
      alphabet,
      orderByMaster: getStorage(storageKeys.masterOnly, false),
      orderByPoints: getStorage(storageKeys.pointsOnly, false),
      capstones: getStorage(storageKeys.capstones, false),
      placeholder: window.compactMode,
      filter,
      filters: getStorage(storageKeys.userFilters, {
        category: [],
        type: [],
        gamemode: [],
      }),
      translation: props.t,
      search: "",
    };
  }

  toggleMasterTierSorting() {
    setStorage(storageKeys.masterOnly, !this.state.orderByMaster);

    this.setState({
      orderByMaster: !this.state.orderByMaster,
    });
  }

  toggleCapstones() {
    setStorage(storageKeys.capstones, !this.state.capstones);

    this.setState({
      capstones: !this.state.capstones,
    });
  }

  togglePointsAvailableSorting() {
    setStorage(storageKeys.pointsOnly, !this.state.orderByPoints);

    this.setState({
      orderByPoints: !this.state.orderByPoints,
    });
  }

  changeFilter(e) {
    const user = this.props.summoner;

    if (user.challenges.length !== 0) {
      const button = e.currentTarget;
      const filter = this.state.filter;

      if (filter === button.id) {
        return;
      }

      if (filter === "alphabetic-a-z") {
        document
          .getElementById("alphabetic-z-a")
          .classList.remove(filterCSS["selected"]);
      } else if (filter === "alphabetic-z-a") {
        document
          .getElementById("alphabetic-a-z")
          .classList.remove(filterCSS["selected"]);
      } else {
        document.getElementById(filter).classList.remove(filterCSS["selected"]);
      }

      button.classList.add(filterCSS["selected"]);

      let tempFilter = button.id;
      let alphabetVar = this.state.alphabet;

      if (tempFilter === "alphabetic-a-z" && alphabetVar === "a-z") {
        alphabetVar = "z-a";
      }

      if (tempFilter === "alphabetic-z-a" && alphabetVar === "z-a") {
        alphabetVar = "a-z";
      }

      this.setState({ filter: tempFilter, alphabet: alphabetVar });
      setStorage(storageKeys.userFilter, tempFilter);
    }
  }

  changeExtraFilter(e) {
    const user = this.props.summoner;
    if (user.challenges.length !== 0) {
      let filters = this.state.filters;

      const toggle = toggleValue(
        filters[e.currentTarget.getAttribute("type")],
        e.currentTarget.id
      );

      if (toggle.method === true) {
        e.currentTarget.classList.add(filterCSS["selected"]);
      } else {
        e.currentTarget.classList.remove(filterCSS["selected"]);
      }

      this.setState({ filters: filters });
      setStorage(storageKeys.userFilters, filters);
    }
  }

  changeDisplayMethod() {
    setCookie("filter", JSON.stringify(!this.state.placeholder));
    window.compactMode = !this.state.placeholder;
    this.setState({ placeholder: !this.state.placeholder });
  }

  search(e) {
    this.setState({ search: e.currentTarget.value });
  }

  componentDidUpdate() {
    const filters = [
      this.state.filter,
      ...Object.values(this.state.filters).flat(),
    ];

    for (const id of filters) {
      if (document.getElementById(id)) {
        document.getElementById(id).classList.add(filterCSS["selected"]);
      }
    }
  }

  render() {
    const t = this.state.translation;
    const user = JSON.parse(JSON.stringify(this.props.summoner));

    if (user.challenges.length === 0) {
      return (
        <div style={{ width: "100%", float: "left" }}>
          <Loader />
          <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>
            Loading Challenges...
          </p>
        </div>
      );
    }
    document.title = `${user.summonerName}'s Challenge Progress Overview`;

    const server = this.props.server;

    const filter = this.state.filter;

    let challengesOrdered = orderChallenges(
      user.challenges,
      this.state.filter,
      this.state.filters,
      this.state.orderByMaster,
      this.state.orderByPoints,
      this.state.search,
      this.state.capstones
    );

    let challenges = challengesOrdered
      .map((challenge) => {
        if (challenge[0] !== 0 && challenge[0] < 10) {
          return null;
        }

        const tier = intToTier(challenge[1]);

        let leaderboardposition = "";
        let position,
          next,
          previousPositions = 1;
        let nexttier = getNextLevel(tier);

        const c = challenge[6];

        if (c.leaderboard === true && challenge[5].length > 1) {
          switch (tier) {
            case "GRANDMASTER":
              previousPositions = c["leaderboardThresholds"][3] ?? 1;
              break;
            case "MASTER":
              previousPositions = c["leaderboardThresholds"][5] ?? 1;
              break;
            default:
              previousPositions = 1;
              break;
          }

          position =
            "#" + beautifyNum(previousPositions - 1 + challenge[5][1], false);
          if (previousPositions - 1 + challenge[5][1] < 0) position = "#%";
          if (challenge[5][1] <= 100 && challenge[5].length === 4) {
            position = position + " (#" + challenge[5][3] + " World)";
          }
          position += " - ";
        }

        if (this.state.orderByMaster === true) {
          nexttier = "MASTER";
        }

        next = 1;
        if (checkExists(c["thresholds"][nexttier])) {
          next = c["thresholds"][nexttier];
        } else if (!checkExists(c["thresholds"][tier])) {
          let stop = false;
          let i = 0;

          while (stop === false && i < 10) {
            i++;
            nexttier = getNextLevel(nexttier);
            if (checkExists(c["thresholds"][nexttier])) {
              next = c["thresholds"][nexttier];
              stop = true;
            }

            if (nexttier === "CHALLENGER") {
              stop = true;
            }
          }
        } else {
          next = c["thresholds"][tier];
        }

        if (tier === "CHALLENGER" && this.state.orderByMaster === false) {
          if (c.leaderboard === true) {
            // leaderboards, not #1
            next = c["leaderboardThresholds"][0] ?? 0;
            nexttier = "CROWN";
          } else {
            // No leaderboards, so maxed
            nexttier = "MAXED";
          }
          if (previousPositions - 1 + challenge[5][1] === 1) {
            // leaderboards, #1
            nexttier = "FIRST";
          }
        }

        let tags = [];

        if (checkExists(challenge[8])) {
          tags.push(
            <img
              key={1}
              className={challenge[8]}
              src={config.images[challenge[8]]}
              alt=""
            />
          );
        }

        if (checkExists(challenge[7]) && challenge[7] !== "none") {
          tags.push(<img key={0} src={config.images[challenge[7]]} alt="" />);
        }

        if (filter === "timestamp") {
          leaderboardposition = (
            <span>
              <span className={challengeCSS.hideOnHover}>
                <Timestamp date={challenge[4]} />
              </span>
              <span className={challengeCSS.showOnHover}>
                <Timestamp date={challenge[4]} type="static" />
              </span>
            </span>
          );
        } else {
          leaderboardposition = (
            <span>
              {position}
              {t("Top {{percent}}%", {
                percent: Math.round(challenge[5][0] * 10000) / 100,
              })}
            </span>
          );
        }

        return (
          <ChallengeObject
            tier={tier}
            nexttier={nexttier}
            title={c.translation.name}
            subtitle={leaderboardposition}
            description={c.translation.description}
            href={"/challenge/" + challenge[0] + "?region=" + server}
            queueIds={tags}
            progressCurrent={challenge[2]}
            progressNext={next}
            key={challenge[0]}
          ></ChallengeObject>
        );
      })
      ?.filter((x) => x !== null);

    if (challenges.length === 0) {
      challenges = (
        <p
          style={{
            color: "white",
            fontSize: "1rem",
            margin: "120px 0",
            textAlign: "center",
            width: "100%",
            float: "left",
          }}
        >
          <i>Is it a bug? Is it a feature?</i>
          <br />
          <br />
          No! There are just no challenges with the currently selected filters.
        </p>
      );
    }

    return (
      <Fragment>
        <div className={filterCSS.filter}>
          <div className={filterCSS.selectors + " clearfix"}>
            <div className={filterCSS.displayMode}>
              <button
                onClick={this.changeDisplayMethod}
                className={filterCSS.modetrue}
              >
                {this.state.placeholder === true ? (
                  <i className="fa-solid fa-list"></i>
                ) : (
                  <i className="fa-solid fa-table-cells"></i>
                )}
              </button>

              <button
                id="capstones"
                onClick={this.toggleCapstones}
                className={filterCSS["points" + this.state.capstones]}
              >
                <img
                  src="https://lolcdn.darkintaqt.com/cdn/c.png"
                  alt=""
                  title="Toggle capstone challenges"
                />
              </button>

              <button
                id="points"
                onClick={this.togglePointsAvailableSorting}
                className={filterCSS["points" + this.state.orderByPoints]}
              >
                <img
                  src="https://lolcdn.darkintaqt.com/cdn/i.png"
                  alt=""
                  title="Toggle non-maxed challenges"
                />
              </button>

              <button
                id="mode"
                onClick={this.toggleMasterTierSorting}
                className={filterCSS["master" + this.state.orderByMaster]}
              >
                <img
                  src="https://lolcdn.darkintaqt.com/cdn/m.png"
                  alt=""
                  title="Set thresholds to master"
                />
              </button>
            </div>
            <p className={filterCSS.info}>Filter</p>
            <div className={filterCSS.category} category="category">
              <p className={filterCSS.cheading}>{t("Order by")}</p>

              <button onClick={this.changeFilter} id="level">
                <i className="fa-solid fa-ranking-star"></i>
                {t("Rank")}
              </button>

              <button onClick={this.changeFilter} id="timestamp">
                <i className="fa-regular fa-clock"></i>
                {t("Last upgraded")}
              </button>

              <button onClick={this.changeFilter} id="percentile">
                <i className="fa-solid fa-hashtag"></i>
                {t("Leaderboard Position")}
              </button>

              <button onClick={this.changeFilter} id="levelup">
                <i className="fa-solid fa-arrow-up-right-dots"></i>
                {t("Closest Levelup")}
              </button>

              <button
                onClick={this.changeFilter}
                id={"alphabetic-" + this.state.alphabet}
              >
                <i
                  className={"fa-solid fa-arrow-down-" + this.state.alphabet}
                ></i>
                {this.state.alphabet.toUpperCase()}
              </button>
            </div>

            <div className={filterCSS.category} category="category">
              <p className={filterCSS.cheading}>{t("Category")}</p>

              <button onClick={this.changeExtraFilter} id="2" type="category">
                <img src={config.images[2]} alt="" />
                {capitalize(getChallenge(2).translation.name)}
              </button>

              <button onClick={this.changeExtraFilter} id="4" type="category">
                <img src={config.images[4]} alt="" />
                {capitalize(getChallenge(4).translation.name)}
              </button>

              <button onClick={this.changeExtraFilter} id="1" type="category">
                <img src={config.images[1]} alt="" />
                {capitalize(getChallenge(1).translation.name)}
              </button>

              <button onClick={this.changeExtraFilter} id="3" type="category">
                <img src={config.images[3]} alt="" />
                {capitalize(getChallenge(3).translation.name)}
              </button>

              <button onClick={this.changeExtraFilter} id="5" type="category">
                <img src={config.images[5]} alt="" />
                {capitalize(getChallenge(5).translation.name)}
              </button>

              <button
                onClick={this.changeExtraFilter}
                id="600006"
                type="category"
              >
                <img src={config.images["600006"]} alt="" />
                Legacy
              </button>

              {/* <button
                onClick={this.changeExtraFilter}
                id="2024300"
                type="category"
              >
                <img
                  src={config.images["2024300"]}
                  alt="2024 seasonal split 3"
                />
                2024.3 Seasonal
              </button> */}

              <button
                onClick={this.changeExtraFilter}
                id="retired-seasonal"
                type="category"
              >
                <img
                  src={config.images["seasonal-retired"]}
                  alt="seasonal outdated"
                />
                Retired Seasonal
              </button>
            </div>

            <div className={filterCSS.category} category="gamemode">
              <p className={filterCSS.cheading}>{t("Gamemode")}</p>

              <button
                onClick={this.changeExtraFilter}
                id="summonersrift"
                type="gamemode"
              >
                <img src={config.images.summonersrift} alt="" />
                Summoners Rift
              </button>

              <button
                onClick={this.changeExtraFilter}
                id="aram"
                type="gamemode"
              >
                <img src={config.images.aram} alt="" />
                ARAM
              </button>

              <button onClick={this.changeExtraFilter} id="bot" type="gamemode">
                <img src={config.images.bot} alt="" />
                Coop vs. AI
              </button>

              <button
                onClick={this.changeExtraFilter}
                id="arena"
                type="gamemode"
              >
                <img src={config.images.arena} alt="" />
                Arena
              </button>
            </div>
          </div>
          <p className={css.legal}>
            <span data-nosnippet>
              Click{" "}
              <a
                href="https://darkintaqt.com/blog/about-challenge-tracker#what-are-all-these-filter-options-on-a-profile-page?"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>{" "}
              to get any questions about this page answered.
            </span>
          </p>
        </div>

        <div
          className={css.parent + " " + css.flexWidth}
          style={this.state.extraStyleNormal}
        >
          <input
            type="text"
            placeholder={t("Search for a challenge")}
            onKeyUp={this.search}
            className={filterCSS.input}
            defaultValue={this.state.search}
          />
          {challenges}
        </div>
      </Fragment>
    );
  }
}

export default withTranslation()(UserChallenges);
