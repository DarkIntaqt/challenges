import notFound from "./../img/not-found.png"
export default function Error(props) {
    let message;
    if (typeof props.message === "undefined") {
        message = "Not found"
    } else {
        message = props.message.status.message
    }

    document.title = "404 Not Found"
    return <div className={"object1000"}>
        <p style={{
            marginTop: "calc(50vh - 150px)",
            color: "white",
            textAlign: "center",
            fontSize: "1rem"
        }}>404 - <b>{message}</b> - Go back by clicking on "League Challenges" in the header</p>
        <img alt="" src={notFound} style={{
            width: "200px",
            height: "200px",
            margin: "10px calc(50% - 100px)"
        }}></img>
    </div>
}