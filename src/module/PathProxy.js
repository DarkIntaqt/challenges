// This file is sort of a proxy to reduce calls to the server
import {
    useParams,
    useLocation,
    //useNavigate
} from "react-router-dom";

import User from "./user/User"
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
    //const navigate = useNavigate();

    const server = config.regions;
    if (!params.server) {
        return <Challenge params={params} query={thisquery}></Challenge>
    }
    if (!server.includes(params.server)) {
        if (params.server === "oce") {

            window.history.replaceState({}, '', "/oc/" + params.user);
            window.location.reload();
        }
        return <Error></Error>
    }
    return <User params={params}></User>
}
