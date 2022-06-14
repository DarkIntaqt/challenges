import {
    useParams,
    useLocation
} from "react-router-dom";
import React from "react"
import User from "./User"
import Error from "./Error"
import Challenge from "./Challenge"

function useQuery() {
    const { search } = useLocation();
    return search.replace("?region=", "");
}

export default function UserObject() {
    let params = useParams();
    let thisquery = useQuery();
    const server = ["br", "euw", "eune", "jp", "kr", "lan", "las", "na", "oc", "tr"];
    if (!params.server) {
        return <Challenge params={params} query={thisquery}></Challenge>
    }
    if (!server.includes(params.server)) {

        return <Error></Error>
    }
    return <User params={params}></User>
}