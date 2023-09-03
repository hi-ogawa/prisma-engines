import WorkerImport from "./worker?worker";
import {
  proxyTinyRpc,
  messagePortClientAdapter,
  TinyRpcProxy,
} from "@hiogawa/tiny-rpc";
import { WorkerApi } from "./worker";

export let workerProxy: TinyRpcProxy<WorkerApi>;

export async function initializeWorkerProxy() {
  const worker = new WorkerImport();
  workerProxy = proxyTinyRpc<WorkerApi>({
    adapter: messagePortClientAdapter({
      port: worker,
    }),
  });
  await workerProxy.init();
}
