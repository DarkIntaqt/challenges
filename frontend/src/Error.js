import notFound from "./img/not-found.png"
export default function Error() {
    document.title = "404 Not Found"
    return <div>
        <p style={{
            color: "white",
            margin: "calc(50vh - 108px) 0 0",
            textAlign: "center",
            fontSize: "1rem"
        }}>404 - Not Found - Go back by clicking on "League Challenges" in the header</p>
        <img alt="" src={notFound} style={{
            width: "200px",
            height: "200px",
            margin: "10px calc(50% - 100px)"
        }}></img>
    </div>
}