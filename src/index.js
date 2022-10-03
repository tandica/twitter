import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/main.scss";
import AppProviders from "./AppProviders";

ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById("root")
);
