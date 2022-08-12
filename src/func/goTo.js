export default function goTo(e, replace = false) {
    if (!e) {
        throw new Error("Missing arguments")
    }
    if (e.ctrlKey || e.metaKey) {
        return
    }
    e.preventDefault();
    let url = new URL(e.currentTarget.href);
    url = url["pathname"] + url["search"] + url["hash"];
    if (replace) {
        window.reactNavigate(url, { replace: true })
        return true;
    }
    window.reactNavigate(url, { replace: false })
    return true
}