import { expect, test } from "bun:test";
import type { UtilType } from "../types";
import decode from "./decode";
import { bytesToHex } from "../utils";

const deserialized =
  "0x2b000000180000001c0000001d000000210000002400000000000000ab2301000045678903000000abcdef";
const deserializedType: UtilType[] = [
  "Bytes",
  "byte",
  "Uint32",
  "Byte3",
  "Bytes",
];

test("table: decode", () => {
  expect(decode(deserialized, deserializedType).join("-")).toBe(
    ["0x", "0xab", "0x123", "0x456789", "0xabcdef"].join("-")
  );

  expect(decode("0x0c0000000800000000000000", ["Bytes"]).join("")).toBe("0x");

  expect(decode("0x0c0000000800000000000000", ["Uint32"]).join("")).toBe("0x0");

  expect(decode("0x0900000008000000ab", ["byte"]).join("")).toBe("0xab");

  expect(decode("0x0b00000008000000456789", ["Byte3"]).join("")).toBe(
    "0x456789"
  );
});
