export default function goTo(e, replace = false) {
    if (!e) {
        throw new Error("Missing arguments")
    }
    if (e.ctrlKey || e.metaKey) {
        return
    }

    let url = new URL(e.currentTarget.href);

    if (
        window.reloadLocation === true ||
        (window.location.pathname.substring(0, 11) === "/challenge/" && url["pathname"].substring(0, 11) === "/challenge/")
    ) {
        return
    } else {
        e.preventDefault();
    }

    url = url["pathname"] + url["search"] + url["hash"];
    if (replace) {
        window.reactNavigate(url, { replace: true })
        return true;
    }
    window.reactNavigate(url, { replace: false })
    return true
}