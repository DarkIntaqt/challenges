// This file is sort of a proxy to reduce calls to the server
import {
    useParams,
    useLocation
} from "react-router-dom";

import User from "./User"
import Error from "./Error"

import Challenge from "./Challenge"

import config from "../config";

function useQuery() {
    const { search } = useLocation();
    return search.replace("?region=", "");
}

export default function PathProxy() {
    let params = useParams();
    let thisquery = useQuery();
    const server = config.regions;
    if (!params.server) {
        return <Challenge params={params} query={thisquery}></Challenge>
    }
    if (!server.includes(params.server)) {

        return <Error></Error>
    }
    return <User params={params}></User>
}
