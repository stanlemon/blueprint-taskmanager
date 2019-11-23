import "react-hot-loader";
import React from "react";
import { render } from "react-dom";
import loadable from "@loadable/component";

const App = loadable(() => import("./components/App"));

render(<App />, document.getElementById("root"));
