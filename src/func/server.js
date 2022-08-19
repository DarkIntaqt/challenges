function serverToHumanReadable(server) {
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

function serverToMachineReadable(server) {
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

function serverToRegionString(server) {
    switch (server) {
        case "br":
        case "br1":
            server = "Brazil"
            break;
        case "euw":
        case "euw1":
            server = "Europe West"
            break;
        case "eune":
        case "eun1":
            server = "Europe Nordic & East"
            break;
        case "jp":
        case "jp1":
            server = "Japan"
            break;
        case "kr":
            server = "Korea"
            break;
        case "lan":
        case "la1":
            server = "Latin America North"
            break;
        case "las":
        case "la2":
            server = "Latin America South"
            break;
        case "na":
        case "na1":
            server = "North America"
            break;
        case "oc":
        case "oc1":
            server = "Oceania"
            break;
        case "tr":
        case "tr1":
            server = "Turkey"
            break;
        default:
            break;
    }
    return server
}


export { serverToHumanReadable, serverToMachineReadable, serverToRegionString }