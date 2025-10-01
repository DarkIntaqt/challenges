import { Component } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { getCache } from "../func/getCheckCache";
import get from "../func/get";

import Loader from "./Loader";

import css from "../css/community.module.css";

const endpoint = "/static/community.json";
const defaultLang = "en";

const langs = navigator.languages || ["en"];

export default class Community extends Component {
  constructor(props) {
    super(props);

    let communities = [];

    const request = getCache(endpoint);

    if (request !== false) {
      communities = request;
    }

    this.state = {
      communities,
    };

    this.loadedStats = this.loadedStats.bind(this);
  }

  loadedStats(data) {
    this.setState({ communities: data });
  }

  componentDidMount() {
    if (this.state.communities.length === 0) {
      get(endpoint, this.loadedStats);
    }
  }

  render() {
    if (this.state.communities.length === 0) {
      return (
        <div style={{ width: "100%", float: "left" }}>
          <Loader />
          <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>
            Loading Communities...
          </p>
        </div>
      );
    }

    document.title = "League of Legends Challenge Community";

    return (
      <div className={css.bgArea}>
        <section className={`object1000`}>
          <div className={css.topArea}>
            <h1 className={css.heading}>
              Meet the <br />
              Challenge-Community
            </h1>
          </div>
        </section>

        <div className={css.scrollSection}>
          <section className={`object1000`} style={{ position: "relative" }}>
            <section
              className={`${css.community} ${css.disclaimer} GRANDMASTER`}
            >
              <div>
                <p data-nosnippet>
                  External links and Discord servers are provided for
                  convenience. No affiliation, endorsement or compensation is
                  involved. External content is not actively monitored, and
                  responsibility for external sites lies with their operators.
                  See the <a href="/tos">TOS</a> for further information.
                  <br />
                  Do you know a cool tool that is missing? Add your community{" "}
                  <a
                    href="https://github.com/DarkIntaqt/challenges/tree/master/public/static"
                    target="_blank"
                    rel="noreferrer"
                  >
                    here
                  </a>
                  .
                </p>
              </div>
            </section>

            {this.state.communities.map((community, i) => {
              let uselang = defaultLang;
              for (let i = 0; i < langs.length; i++) {
                if (community.langs.includes(langs[i])) {
                  uselang = langs[i];
                  break;
                }
              }

              // in case a community isnt available in default lang and other langs are not available
              if (!community[uselang]) {
                return <></>;
              }

              const translated = community[uselang];

              return (
                <div className={css.community} key={i}>
                  <div>
                    <h2>{translated.title}</h2>
                    <p>
                      {translated.description}
                      <span>
                        <a href={translated.link}>
                          <i className={community.icon} /> {translated.cta}
                        </a>
                      </span>
                    </p>
                  </div>
                  <LazyLoadImage
                    alt={translated.title}
                    src={community.image}
                    width={210}
                    height={210}
                  />
                </div>
              );
            })}
          </section>
        </div>
      </div>
    );
  }
}
