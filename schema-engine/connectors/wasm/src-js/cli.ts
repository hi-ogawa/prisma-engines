import { loadWasm } from "./node";
import { tinyCliMain, TinyCliCommand, arg } from "@hiogawa/tiny-cli";
import { version as packageVersion } from "../package.json";
import * as pkg from "../pkg/index";
import fs from "node:fs";

const cli = new TinyCliCommand(
  {
    program: "prisma-schema-diff-wasm",
    version: packageVersion,
    args: {
      to: arg.string("'To' prisma.schema file", { positional: true }),
      from: arg.string("'From' prisma.schema file (default: empty schema)", {
        optional: true,
      }),
    },
  },
  async ({ args }) => {
    const to = fs.readFileSync(
      args.to === "-" ? process.stdin.fd : args.to,
      "utf-8",
    );
    const from = args.from ? fs.readFileSync(args.from, "utf-8") : "";
    await pkg.default(await loadWasm());
    const output = pkg.schema_diff(from, to);
    console.log(output);
  },
);

tinyCliMain(cli);
