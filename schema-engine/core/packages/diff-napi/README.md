# prisma-diff-napi

```sh
pnpm build
pnpm build --release --strip
```

```js
const lib = require("./index.js");
const sql = await lib.diffSchema(
  `
    model counter {
        id    Int @id @default(autoincrement())
    }
  `,
  `
    model counter {
        id    Int @id @default(autoincrement())
        value Int
    }
  `,
);
console.log(sql);
// -- AlterTable
// ALTER TABLE "counter" ADD COLUMN     "value" INTEGER NOT NULL;
```

## todo

- choose features to reduce binary size?
- is wasm-bindgen build possible since no IO needed for raw prisma schema diff feature?
- frontend? (prisma.schema editor + generate raw sql for migration)

## links

- https://github.com/napi-rs/napi-rs/issues/796
