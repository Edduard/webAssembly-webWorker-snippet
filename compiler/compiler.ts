const wasm2js = require("wasm2js");
const fs = require("fs");

export function compileWasm() {
  const wasmBuffer = fs.readFileSync("../example/pow.wasm");
  const js = wasm2js(wasmBuffer);

  return js;
}
