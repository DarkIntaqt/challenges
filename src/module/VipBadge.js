export default function VipBadge(params) {

    const defaultSize = "20px";
    const defaultPosition = "relative";
    const defaultMargin = "0 5px";

    const size = params.size ?? defaultSize
    const position = params.position ?? defaultPosition
    const margin = params.margin ?? defaultMargin

    return <img src="https://cdn.darkintaqt.com/lol/static/challenges/verified.png" style={{
        height: `calc(0.7 * ${size}`,
        width: `calc(0.7 * ${size}`,
        borderRadius: "50%",
        margin: margin,
        top: "0",
        left: "0",
        position: position,
    }} alt="verified" />
}