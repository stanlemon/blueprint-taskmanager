/* istanbul ignore file */
import React from "react";
import { Provider } from "react-redux";
import Routes from "./Routes";
import store from "../store";
import "rsuite/styles/index.less";

export default function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}
