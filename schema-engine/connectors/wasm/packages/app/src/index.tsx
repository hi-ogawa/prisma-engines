import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { ReactQueryWrapper } from "./react-query-utils";
import { Toaster } from "react-hot-toast";

function main() {
  const el = document.querySelector("#root");
  tinyassert(el);
  const reactRoot = createRoot(el);
  reactRoot.render(<Root />);
}

function Root() {
  return (
    <ReactQueryWrapper>
      <Toaster
        toastOptions={{
          className: "!bg-colorBgElevated !text-colorText",
        }}
      />
      <App />
    </ReactQueryWrapper>
  );
}

main();
