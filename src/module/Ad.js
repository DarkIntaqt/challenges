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
                <div className={styles.adContent}>
                    <ins className="adsbygoogle"
                        style={{ display: "inline-block", width: "290px", height: "290px", margin: "0 auto" }}
                        data-ad-client="ca-pub-6052444447665495"
                        data-ad-slot="2200253704"></ins>
                </div>
            </div>)
        }
    }

    return <div className={style}>
        {ads}
    </div>
}