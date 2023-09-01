# prisma-diff-napi

```sh
pnpm build
pnpm build --release --strip
pnpm test
```

## todo

- choose features to reduce binary size?
- is wasm-bindgen build possible since no IO needed for raw prisma schema diff feature?
- frontend? (prisma.schema editor + generate raw sql for migration)

## links

- https://github.com/napi-rs/napi-rs/issues/796
