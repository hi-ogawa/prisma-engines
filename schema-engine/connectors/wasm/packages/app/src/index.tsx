import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { ReactQueryWrapper } from "./react-query-utils";
import React from "react";
import { toast } from "./toast";

function main() {
  const el = document.querySelector("#root");
  tinyassert(el);
  const reactRoot = createRoot(el);
  reactRoot.render(<Root />);
}

function Root() {
  React.useEffect(() => toast.render(), []);

  return (
    <ReactQueryWrapper>
      <App />
    </ReactQueryWrapper>
  );
}

main();
