import React from "react";
import ReactDOM from "react-dom";

var App = require("./src/App.es6.react.js").default;
let io = require(`./src/io-electron.js`);

const reactNode = React.createElement(App, {
  db: "etc/data/gi-assets.nedb",
  io,
  env: "electron"
});

ReactDOM.render(reactNode, document.body.querySelector("#app"));
