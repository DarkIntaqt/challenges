import { Component } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { getCache } from "../func/getCheckCache";
import get from "../func/get";

import Loader from "./Loader";

import css from "../css/community.module.css"

export default class Community extends Component {
    constructor(props) {
        super(props)

        let images = []
        let texts = []

        const request = getCache("https://challenges.darkintaqt.com/communities.json")

        if (request !== false) {
            images = request.images
            texts = request.texts
        }

        this.state = {
            images: images,
            texts: texts
        }

        this.loadedStats = this.loadedStats.bind(this)
    }



    loadedStats(data) {
        this.setState({ images: data.images, texts: data.texts })
    }


    componentDidMount() {

        get("https://challenges.darkintaqt.com/communities.json", this.loadedStats)

    }


    render() {


        if (this.state.images.length === 0 || this.state.texts.length === 0) {

            return <div style={{ width: "100%", float: "left" }}>
                <Loader />
                <p style={{ color: "white", fontSize: "1rem", textAlign: "center" }}>Loading Communities...</p>
            </div>

        }


        let islands = this.state.texts.map(function (data) {
            return <div key={data[0]} className={css.floatingIsland}>
                <h2>{data[0]}</h2>
                <p>{data[1]}

                    <span><a href={data[2]} target="_blank" rel="noreferrer"><i className={data[4]} /> {data[3]}</a></span>
                </p>
            </div>
        })
        let images = this.state.images.map(function (data) {
            return <LazyLoadImage key={data} src={data} height={240} width={240}></LazyLoadImage>
        })



        document.title = "League of Legends Challenge Community"

        return <div className={css.bgArea}>
            <section className={`object1000`}>

                <div className={css.topArea}>
                    <h1 className={css.heading}>Meet the <br />Challenge-Community</h1>
                </div>


            </section>

            <div className={css.scrollSection}>
                <section className={`object1000`} style={{ position: 'relative' }}>

                    {islands}

                    {images}

                </section>

            </div>

        </div>
    }
}