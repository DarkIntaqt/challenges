import React from "react";
import styles from "../css/ad.module.css"

export default function Ad(props) {

    let adcount = 3;

    if (window.innerWidth < 1400) {
        adcount = 1;
    }

    let placeholder = props.placeholder;

    let ads = [];

    let style = styles.adArea;

    if (placeholder === "false") {
        style += " " + styles.filled
        for (var i = 0; i < adcount; i++) {
            ads.push(<div className={styles.ad} key={i}>
                <p>Advertisement</p>
                <div className={styles.adContent}>
                    <ins className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client="ca-pub-6052444447665495"
                        data-ad-slot="2200253704"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                        data-ad-status="unfilled">
                    </ins>
                </div>
            </div>)
        }
    }

    return <div className={style}>
        {ads}
    </div>
}