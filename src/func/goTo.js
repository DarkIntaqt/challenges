export default function goTo(e, replace = false) {
    if (!e) {
        throw new Error("Missing arguments")
    }
    if (e.ctrlKey || e.metaKey) {
        return
    }
    e.preventDefault();
    let url = new URL(e.currentTarget.href);
    url = url["pathname"] + url["search"];
    if (replace) {
        window.reactNavigate(url)
        return true;
    }
    window.reactNavigate(url)
    return true
}