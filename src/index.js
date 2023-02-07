import * as React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const __INITIAL_DATA__ = window.__INITIAL_DATA__;
ReactDOM.hydrate(
  <App {...__INITIAL_DATA__} />,
  document.getElementById("root")
);
