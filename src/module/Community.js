import { Component } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import css from "../css/community.module.css"

export default class Community extends Component {
    render() {

        document.title = "League of Legends Challenge Community"

        return <div className={css.bgArea}>
            <section className={`object1000`}>

                <div className={css.topArea}>
                    <h1 className={css.heading}>Meet the <br />Challenge-Community</h1>
                </div>


            </section>

            <div className={css.scrollSection}>
                <section className={`object1000`} style={{ position: 'relative' }}>

                    <LazyLoadImage src="https://lolcdn.darkintaqt.com/s/legend.png" height={240} width={240}></LazyLoadImage>

                    <div className={css.floatingIsland}>
                        <h2>Challenge Discord - Achievement Hunting</h2>
                        <p>The discord server is for League of Legends and is dedicated to challenges. We are specifically here to enable players to connect together and to complete challenges. The first 100 active players have reached the top 200 globally in terms of challenge points and this feat was achieved together as a group.

                            <span><a href="https://discord.gg/AC5MH7qUGe" target="_blank" rel="noreferrer"><i className="fa-brands fa-discord" /> Join Discord</a></span>
                        </p>
                    </div>

                </section>


            </div>

        </div>
    }
}