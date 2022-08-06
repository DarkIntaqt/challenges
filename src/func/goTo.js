export default function goTo(e, replace = false) {
    if (!e) {
        throw new Error("Missing arguments")
    }
    if (e.ctrlKey || e.metaKey) {
        return
    }
    e.preventDefault();
    let loc = new URL(e.currentTarget.href);
    loc = loc["pathname"] + loc["search"];

}