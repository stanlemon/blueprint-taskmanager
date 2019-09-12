import "whatwg-fetch";
import "react-hot-loader";
import React from "react";
import { render } from "react-dom";
import App from "./components/App";

render(<App />, document.getElementById("root"));

// Only used in dev for hot-reloading
if (module.hot) {
    module.hot.accept();
}
