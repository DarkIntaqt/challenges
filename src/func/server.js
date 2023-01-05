function serverToHumanReadable(server) {
    switch (server) {
        case "br1":
            return "br"

        case "euw1":
            return "euw"

        case "eun1":
            return "eune"

        case "jp1":
            return "jp"

        case "kr":
            break;

        case "la1":
            return "lan"

        case "la2":
            return "las"

        case "na1":
            return "na"

        case "oc1":
            return "oc"

        case "ru":
            return "ru"

        case "tr1":
            return "tr"

        case "ph2":
            return "ph"

        case "sg2":
            return "sg"

        case "th2":
            return "th"

        case "tw2":
            return "tw"

        case "vn2":
            return "vn"

        default:
            break;
    }
    return server
}

function serverToMachineReadable(server) {
    switch (server) {
        case "br":
            return "br1"

        case "euw":
            return "euw1"

        case "eune":
            return "eun1"

        case "jp":
            return "jp1"

        case "kr":
            break;

        case "lan":
            return "la1"

        case "las":
            return "la2"

        case "na":
            return "na1"

        case "oc":
            return "oc1"

        case "ru":
            return "ru"

        case "tr":
            return "tr1"

        case "ph":
            return "ph2"

        case "sg":
            return "sg2"

        case "th":
            return "th2"

        case "tw":
            return "tw2"

        case "vn":
            return "vn2"

        default:
            break;
    }
    return server
}

function serverToRegionString(server) {
    switch (server) {
        case "br":
        case "br1":
            return "Brazil"

        case "euw":
        case "euw1":
            return "Europe West"

        case "eune":
        case "eun1":
            return "Europe Nordic & East"

        case "jp":
        case "jp1":
            return "Japan"

        case "kr":
            return "Korea"

        case "lan":
        case "la1":
            return "Latin America North"

        case "las":
        case "la2":
            return "Latin America South"

        case "na":
        case "na1":
            return "North America"

        case "oc":
        case "oc1":
            return "Oceania"

        case "ru":
            return "Russia"

        case "tr":
        case "tr1":
            return "Turkey"

        default:
            break;
    }
    return server
}


export { serverToHumanReadable, serverToMachineReadable, serverToRegionString }