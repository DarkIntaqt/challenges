import {
    useParams
} from "react-router-dom";
import User from "./User"
import Error from "./Error"

export default function UserObject() {
    let params = useParams();
    const server = ["br", "euw", "eune", "jp", "kr", "lan", "las", "na", "oc", "tr"];
    if (!server.includes(params.server)) {
        return <Error></Error>
    }
    return <User params={params}></User>
}