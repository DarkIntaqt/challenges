
import { useNavigate } from "react-router-dom";

export default function VariableProxy() {

    window.reactNavigate = useNavigate()

    return <div style={{ display: "none" }}></div>;

}