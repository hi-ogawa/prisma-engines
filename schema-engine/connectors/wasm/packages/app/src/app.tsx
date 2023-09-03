import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { initializeWorkerProxy, workerProxy } from "./worker-proxy";
import { setTheme, getTheme } from "@hiogawa/theme-script";

export function App() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-col items-center">
        <AppInner />
      </div>
    </div>
  );
}

function AppInner() {
  const [schemaFrom, setSchemaFrom] = React.useState(DEMO_SCHEMAS[0]!);
  const [schemaTo, setSchemaTo] = React.useState(DEMO_SCHEMAS[1]!);
  const [flavour, setFlavour] = React.useState("postgres");

  const initQuery = useInitWorkerQuery();

  const diffMutation = useMutation({
    mutationFn: () => workerProxy.schema_diff(flavour, schemaFrom, schemaTo),
  });

  return (
    <div className="p-4 mx-auto w-full max-w-xl">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          From
          <textarea
            className="antd-input font-mono text-xs p-1"
            rows={12}
            value={schemaFrom}
            onChange={(e) => setSchemaFrom(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          To
          <textarea
            className="antd-input font-mono text-xs p-1"
            rows={12}
            value={schemaTo}
            onChange={(e) => setSchemaTo(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          Flavour
          <select
            className="antd-input p-1"
            value={flavour}
            onChange={(e) => setFlavour(e.target.value)}
          >
            {["postgres", "mysql", "sqlite", "cockroach", "mssql"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <button
          className="antd-btn antd-btn-primary p-1"
          disabled={!initQuery.isSuccess || diffMutation.isPending}
          onClick={() => {
            diffMutation.mutate();
          }}
        >
          Generate SQL
        </button>
        <label className="flex flex-col gap-1 pt-2">
          Output {diffMutation.isError && "(Error)"}
          <textarea
            className="antd-input font-mono text-xs p-1"
            aria-invalid={diffMutation.isError}
            rows={15}
            readOnly
            disabled
            value={diffMutation.data ?? diffMutation.error?.message ?? ""}
          />
        </label>
      </div>
    </div>
  );
}

const DEMO_SCHEMAS = [
  `\
model User {
  id        Int @id @default(autoincrement())
}
`,
  `\
model User {
  id        Int @id @default(autoincrement())
  profile   Profile?
}

model Profile {
  id        Int @id @default(autoincrement())
  bio       String
  user      User      @relation(fields: [userId], references: [id])
  userId    Int @unique
}
`,
];

function Header() {
  const initQuery = useInitWorkerQuery();

  return (
    <header className="top-0 sticky antd-body flex items-center p-2 px-4 gap-3 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7] z-1">
      <div>prisma-schema-diff-wasm</div>
      <div className="flex-1"></div>
      {initQuery.isLoading && (
        <span className="antd-spin w-4 h-4" title="Loading wasm..."></span>
      )}
      <ThemeSelect />
      <a
        className="antd-btn antd-btn-ghost i-ri-github-line w-6 h-6"
        href="https://github.com/hi-ogawa/prisma-engines/pull/2"
        target="_blank"
      ></a>
    </header>
  );
}
function ThemeSelect() {
  return (
    <button
      className="flex items-center antd-btn antd-btn-ghost"
      onClick={() => {
        setTheme(getTheme() === "dark" ? "light" : "dark");
      }}
    >
      <span className="dark:i-ri-sun-line light:i-ri-moon-line !w-5 !h-5"></span>
    </button>
  );
}

function useInitWorkerQuery() {
  return useQuery({
    queryKey: ["initializeWorkerProxy"],
    queryFn: async () => {
      await initializeWorkerProxy();
      return null;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
