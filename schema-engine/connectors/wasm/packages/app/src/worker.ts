import * as pkg from "@hiogawa/prisma-schema-diff-wasm";
import PKG_WASM_URL from "@hiogawa/prisma-schema-diff-wasm/pkg/index_bg.wasm?url";
import { exposeTinyRpc, messagePortServerAdapter } from "@hiogawa/tiny-rpc";

export type WorkerApi = typeof workerApi;

const workerApi = {
  async init() {
    await pkg.default(PKG_WASM_URL);
  },
  schema_diff: pkg.schema_diff,
};

function main() {
  pkg.default;
  exposeTinyRpc({
    routes: workerApi,
    adapter: messagePortServerAdapter({
      port: globalThis,
      onError(e) {
        console.error("[TinyRpcWorker]", e);
      },
    }),
  });
}

main();
