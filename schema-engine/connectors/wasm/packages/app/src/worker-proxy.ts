import WorkerImport from "./worker?worker";
import {
  proxyTinyRpc,
  messagePortClientAdapter,
  TinyRpcProxy,
} from "@hiogawa/tiny-rpc";
import { WorkerApi } from "./worker";
import { once } from "@hiogawa/utils";

export let workerProxy: TinyRpcProxy<WorkerApi>;

export const initializeWorkerProxy = once(async () => {
  const worker = new WorkerImport();
  workerProxy = proxyTinyRpc<WorkerApi>({
    adapter: messagePortClientAdapter({
      port: worker,
    }),
  });
  await workerProxy.init();
});
