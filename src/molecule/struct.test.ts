import { expect, test } from "bun:test";
import StructLayout from "./struct";

const table = new StructLayout(
  {
    f1: "byte",
    f2: "Uint32",
    f3: "Bytes",
  },
  ["f1", "f2", "f3"]
);

test("Struct Layout", () => {
  // struct encode
  expect(
    table.encode({
      f1: "0xab",
      f2: "0x010203",
      f3: "0xabcdef",
    })
  ).toBe("0xab03020100abcdef");

  // struct decode
  expect(table.decode("0xab03020100abcdef")).toMatchObject({
    f1: "0xab",
    f2: "0x010203",
    f3: "0xabcdef",
  });
});
