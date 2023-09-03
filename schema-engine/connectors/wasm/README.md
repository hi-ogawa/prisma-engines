# @hiogawa/prisma-schema-diff-wasm

## usage

```
$ prisma-schema-diff-wasm --help
prisma-schema-diff-wasm/0.0.1-pre.0

Usage:
  $ prisma-schema-diff-wasm [options] <to>

Positional arguments:
  to    'To' prisma.schema file

Options:
  --from=...       'From' prisma.schema file (default: empty schema)
  --flavour=...    database flavour (default: postgres)

$ echo -e 'model users { \n id Int @id \n }' | prisma-schema-diff-wasm -
-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
```

## development

```sh
pnpm build
pnpm test
node bin/cli.js misc/example.prisma
pnpm release
```
