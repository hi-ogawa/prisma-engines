import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

// helper for loading wasm binary on nodejs

export async function loadWasm() {
  // resolve wasm binary path
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const wasmPath = path.resolve(__dirname, "..", "pkg", "index_bg.wasm");

  // load wasm module
  const wasmSource = await fs.promises.readFile(wasmPath);
  const wasmModule = await WebAssembly.compile(wasmSource);
  return wasmModule;
}
