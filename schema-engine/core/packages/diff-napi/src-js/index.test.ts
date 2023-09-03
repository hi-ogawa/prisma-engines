import { describe, it, expect } from "vitest";
const { diffSchema, diffSchema2 } = require("../index.js");

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
    // no alter table supported for sqlite or does it require some special setup with real connection?
    expect(diffSchema("sqlite", schemaFrom, schemaTo)).toMatchInlineSnapshot(`
      "-- RedefineTables
      PRAGMA foreign_keys=OFF;
      CREATE TABLE \\"new_counter\\" (
          \\"id\\" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          \\"value\\" INTEGER NOT NULL
      );
      INSERT INTO \\"new_counter\\" (\\"id\\") SELECT \\"id\\" FROM \\"counter\\";
      DROP TABLE \\"counter\\";
      ALTER TABLE \\"new_counter\\" RENAME TO \\"counter\\";
      PRAGMA foreign_key_check;
      PRAGMA foreign_keys=ON;
      "
    `);
  });
});

describe(diffSchema2, () => {
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
    expect(diffSchema2("postgres", schemaFrom, schemaTo))
      .toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \\"counter\\" ADD COLUMN     \\"value\\" INTEGER NOT NULL;
      "
    `);
    expect(diffSchema2("mysql", schemaFrom, schemaTo)).toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \`counter\` ADD COLUMN \`value\` INTEGER NOT NULL;
      "
    `);
  });
});
