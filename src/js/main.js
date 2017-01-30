import "../css/main.css"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

const app = document.getElementById("app")

ReactDOM.render(<App store={App} />, app)

