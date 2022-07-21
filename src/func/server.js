export default function server(method, server) {
    if (method === "human") {
        switch (server) {
            case "br1":
                server = "br"
                break;
            case "euw1":
                server = "euw"
                break;
            case "eun1":
                server = "eune"
                break;
            case "jp1":
                server = "jp"
                break;
            case "kr":
                break;
            case "la1":
                server = "lan"
                break;
            case "la2":
                server = "las"
                break;
            case "na1":
                server = "na"
                break;
            case "oc1":
                server = "oc"
                break;
            case "tr1":
                server = "tr"
                break;
            default:
                break;
        }
        return server
    }
    else if (method === "machine") {
        switch (server) {
            case "br":
                server = "br1"
                break;
            case "euw":
                server = "euw1"
                break;
            case "eune":
                server = "eun1"
                break;
            case "jp":
                server = "jp1"
                break;
            case "kr":
                break;
            case "lan":
                server = "la1"
                break;
            case "las":
                server = "la2"
                break;
            case "na":
                server = "na1"
                break;
            case "oc":
                server = "oc1"
                break;
            case "tr":
                server = "tr1"
                break;
            default:
                break;
        }
        return server
    } return ""
}