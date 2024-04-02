import { expect, test } from "bun:test";
import TableLayout from "./table";

const table = new TableLayout(
  {
    f1: "Bytes",
    f2: "byte",
    f3: "Uint32",
    f4: "Byte3",
    f5: "Bytes",
  },
  ["f1", "f2", "f3", "f4", "f5"]
);

test("Table Layout", () => {
  // table encode
  expect(
    table.encode({
      f1: "0x",
      f2: "0xab",
      f3: "0x123",
      f4: "0x456789",
      f5: "0xabcdef",
    })
  ).toBe(
    "0x2b000000180000001c0000001d000000210000002400000000000000ab2301000045678903000000abcdef"
  );

  // table decode
  expect(
    table.decode(
      "0x2b000000180000001c0000001d000000210000002400000000000000ab2301000045678903000000abcdef"
    )
  ).toMatchObject({
    f1: "0x",
    f2: "0xab",
    f3: "0x123",
    f4: "0x456789",
    f5: "0xabcdef",
  });
});
