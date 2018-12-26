import React, { Component } from "react";
import Styled from "./App.css.js";

var shellton = require("shellton");
var through = require("through2");

class App extends Component {
  constructor(props) {
    super(props);
    this.bound = { runSomeJulia: this.runSomeJulia.bind(this) };
  }

  runSomeJulia(d) {
    var input = through();
    var resElm = document.querySelector("#result");
    resElm.innerText = "";

    function outputStream(name, eachChunk) {
      var someFunc = d => {
        return `${d}`;
      };

      var stream = through();
      stream.on("data", function(chunk) {
        eachChunk(someFunc(chunk));
      });

      return stream;
    }

    var output = outputStream("log", d => {
      resElm.innerText = resElm.innerText + d + "...\n";
    });
    var error = outputStream("error", d => process.stderr.write(d));

    shellton({
      task: "julia jl/test.jl",
      stdin: input,
      stdout: output,
      stderr: error
    });

    Array(20)
      .fill(1)
      .map((d, i) => {
        if (Math.random() > 0.7) {
          input.write(`error ${i}\n`);
        } else {
          input.write(`${i}\n`);
        }
      });
    input.end();
  }

  render() {
    const { env } = this.props;
    const { runSomeJulia } = this.bound;

    return (
      <Styled className="app">
        {env === "electron" && <div />}
        <div id="juliaInteractive">
          <button onClick={runSomeJulia}>Run Julia</button>
        </div>
        <div id="result" />
      </Styled>
    );
  }
}

export default App;
