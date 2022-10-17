import React, {
    Component
} from 'react';

import loaderCSS from "../css/loader.module.css"

export default class Loader extends Component {
    render() {
        return <div className={loaderCSS.loader}></div>;
    }
}