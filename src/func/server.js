export default function server(server) {
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
}