export default function shortCDN(championId, action = 99) {

    let path = "https://lolcdn.darkintaqt.com/cdn/champion/" + championId;
    let newP = false;

    switch (action) {
        case 1:
            path += "/square";
            break;
        case 2:
            newP = true;
            break;
        case 3:
            path += "/abilities";
            break;
        case 4:
            path += "/splash";
            break;
        case 5:
            path += "/tile";
            break;
        case 6:
            path += "/splashCentered";
            break;
        case 7:
            path += "/abilities";
            break;
        case 8:
            newP = true;
            break;

        default:

    }
    if (newP === false) {
        return path;
    }
    return "https://lolcdn.darkintaqt.com/s/e-" + ((championId) * 7).toString(16) + "-" + (action * (championId)).toString(16)
}