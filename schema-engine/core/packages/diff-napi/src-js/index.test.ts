import { describe, it, expect } from "vitest";
const { diffSchema } = require("../index.js");

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
    expect(diffSchema("postgres", schemaFrom, schemaTo)).toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \\"counter\\" ADD COLUMN     \\"value\\" INTEGER NOT NULL;
      "
    `);
    expect(diffSchema("mysql", schemaFrom, schemaTo)).toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \`counter\` ADD COLUMN \`value\` INTEGER NOT NULL;
      "
    `);
  });
});
