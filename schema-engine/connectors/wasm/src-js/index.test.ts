import { beforeAll, describe, expect, it } from "vitest";
import * as pkg from "../pkg/index";
import { loadWasm } from "../dist/node";

beforeAll(async () => {
  await pkg.default(await loadWasm());
});

describe(pkg.schema_diff, () => {
  it("basic", () => {
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
    expect(pkg.schema_diff("postgres", schemaFrom, schemaTo))
      .toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \\"counter\\" ADD COLUMN     \\"value\\" INTEGER NOT NULL;
      "
    `);
    expect(pkg.schema_diff("mysql", schemaFrom, schemaTo))
      .toMatchInlineSnapshot(`
      "-- AlterTable
      ALTER TABLE \`counter\` ADD COLUMN \`value\` INTEGER NOT NULL;
      "
    `);
    expect(pkg.schema_diff("sqlite", schemaFrom, schemaTo))
      .toMatchInlineSnapshot(`
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
