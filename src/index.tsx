import * as React from "react";
import * as ReactDOM from "react-dom";
import {Tetris} from "./components/Tetris";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <Tetris/>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
