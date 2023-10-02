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

$ prisma-schema-diff-wasm - <<EOF
datasource db {
  provider = "mysql"
  url      = "__dummy_url"
}
model users {
  id    Int @id @default(autoincrement())
}
EOF
-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## development

```sh
pnpm i
pnpm build
pnpm test
node bin/cli.js misc/example.prisma
pnpm release
```
