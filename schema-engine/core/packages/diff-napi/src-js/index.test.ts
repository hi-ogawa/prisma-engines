import { describe, it, expect } from "vitest";
const { diffSchema, diffSchemaSync } = require("../index.js");

describe(diffSchema, () => {
  it("basic", async () => {
    const schemaFrom = `
      model counter {
          id    Int @id @default(autoincrement())
      }
    `;
    const schemaTo = `
      model counter {
          id    Int @id @default(autoincrement())
          value Int
      }
    `;
    expect(await diffSchema("postgres", schemaFrom, schemaTo))
      .toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \\"counter\\" ADD COLUMN     \\"value\\" INTEGER NOT NULL;
      "
    `);
    expect(await diffSchema("mysql", schemaFrom, schemaTo))
      .toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \`counter\` ADD COLUMN \`value\` INTEGER NOT NULL;
      "
    `);
  });
});

describe(diffSchemaSync, () => {
  it("basic", async () => {
    const schemaFrom = `
      model counter {
          id    Int @id @default(autoincrement())
      }
    `;
    const schemaTo = `
      model counter {
          id    Int @id @default(autoincrement())
          value Int
      }
    `;
    expect(diffSchemaSync("postgres", schemaFrom, schemaTo))
      .toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \\"counter\\" ADD COLUMN     \\"value\\" INTEGER NOT NULL;
      "
    `);
    expect(diffSchemaSync("mysql", schemaFrom, schemaTo))
      .toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \`counter\` ADD COLUMN \`value\` INTEGER NOT NULL;
      "
    `);
  });
});
