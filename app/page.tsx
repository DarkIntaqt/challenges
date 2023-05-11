"use client";

import css from "challenges/styles/index.module.scss";
import { Component } from "react";
import Head from "next/head";
import Searchbar from "challenges/components/Searchbar";

export default class Start extends Component {
  render() {
    const images = [
      [131, "splashCentered", 47], /* anivia */
      [254, "splash", 29], /* arcane vi */
      [38, "splash", 14], /* arcane kassadin */
      [43, "splash", 7], /* red eye karma */
      [2, "splash", 25], /* olaf */
      [432, "splash", 8], /* astronaut bard */
      [104, "splash", 5], /* pool party graves */
      [114, "splash", 1], /* fiora */
      [131, "splash", 26], /* divine diana */
      [60, "splash", 6], /* halloween elise */
      [24, "splash", 13], /* jax */
      [78, "splash", 14] /* xmas poppy */
    ];

    // set the image based on the month
    const image = images[new Date().getMonth()];


    return <>

      <Head>
        <title>League of Legends Challenge Tracker and Progress Lookup</title>
      </Head>

      <div className={css.start}>

        <div className={css.bgwrapper} style={{
          backgroundImage: `url(https://lolcdn.darkintaqt.com/cdn/champion/${image[0]}/${image[2]}/${image[1]})`
        }}>
        </div>

        <div className={css.wrapper}>

          <div className={css.heading}>

            <span>League of Legends</span>
            <h1>Challenge Tracker</h1>

          </div>

          <Searchbar />

        </div>

      </div>
    </>;
  }
}