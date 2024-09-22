import { Component, Fragment } from "react";
import Ad from "./Ad";
import css from "../css/ad.module.css"

export default class Wrapper extends Component {
    constructor(params) {
        super(params)
        this.props = params

        let adUnits = 4

        if (window.innerHeight < 600) {
            adUnits = 2
        }

        if (window.innerHeight > 950) {
            adUnits = 6
        }
        if (window.innerWidth < 1600) {
            adUnits = 0
        }

        let unitsLeft = []
        let unitsRight = []

        for (let i = 0; i < (adUnits / 2); i++) {
            unitsRight.push(<Ad id={i + 1} key={i} />)

        }

        this.checkAdRemount = this.checkAdRemount.bind(this)

        this.tries = 0

        this.state = {
            adUnits: {
                "enabled": params.showAds ?? true,
                "int": adUnits,
                "left": unitsLeft,
                "right": unitsRight
            }
        }


    }

    updateProps() {
        this.setState({
            adUnits: {
                enabled: true,
                int: this.state.adUnits.int,
                left: this.state.adUnits.left,
                right: this.state.adUnits.right
            }
        })
    }

    componentDidUpdate(prevProps) {

        if (this.state.adUnits.enabled !== prevProps.showAds ?? true) {
            setTimeout(() => {
                if (this.state.adUnits.enabled !== prevProps.showAds ?? true) {
                    this.setState({
                        adUnits: {
                            enabled: true,
                            int: this.state.adUnits.int,
                            left: this.state.adUnits.left,
                            right: this.state.adUnits.right
                        }
                    })
                }
            }, 500)

        }
    }

    checkAdRemount() {
        let checkAdUnits = this.state.adUnits.int
        let adUnits = 4
        if (window.innerHeight < 600) {
            adUnits = 2
        }
        if (window.innerWidth < 1600) {
            adUnits = 0
        }

        if (adUnits !== checkAdUnits) {
            this.tries++;
            if (this.tries > 4 && adUnits > checkAdUnits) {
                return
            }

            let unitsLeft = []
            let unitsRight = []

            for (let i = 0; i < (adUnits / 2); i++) {
                unitsRight.push(<Ad id={i + 1} key={i} />)

            }

            this.setState({
                adUnits: {
                    "int": adUnits,
                    "left": unitsLeft,
                    "right": unitsRight
                }
            })
        }


    }

    componentDidMount() {
        window.addEventListener("resize", this.checkAdRemount)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.checkAdRemount)
    }

    render() {
        return <Fragment>
            {/* {this.state.adUnits.enabled === true ?
                <div className={`${css.fixed}`}>
                    {this.state.adUnits.left}
                </div> : null} */}
            <div className={"object1000"}>
                {this.props.children}
            </div>
            {this.state.adUnits.enabled === true ?
                <div className={`${css.fixed} ${css.right}`}>
                    {this.state.adUnits.right}
                </div> : null}
        </Fragment>
    }
}