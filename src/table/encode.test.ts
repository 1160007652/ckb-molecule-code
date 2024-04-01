import { expect, test } from "bun:test";
import type { IMolecule } from "../types";
import encode from "./encode";

const deserialized: IMolecule = new Map([
  ["f1", ["0x", "Bytes"]],
  ["f2", ["0xab", "byte"]],
  ["f3", ["0x123", "Uint32"]],
  ["f4", ["0x456789", "Byte3"]],
  ["f6", ["0xabcdef", "Bytes"]],
]);

test("table: encode", () => {
  expect(encode(deserialized)).toBe(
    "0x2b000000180000001c0000001d000000210000002400000000000000ab2301000045678903000000abcdef"
  );

  expect(encode(new Map([["f1", ["0x", "Bytes"]]]))).toBe(
    "0x0c0000000800000000000000"
  );

  expect(encode(new Map([["f1", ["0x0", "Uint32"]]]))).toBe(
    "0x0c0000000800000000000000"
  );

  expect(encode(new Map([["f1", ["0x00", "Uint32"]]]))).toBe(
    "0x0c0000000800000000000000"
  );

  expect(encode(new Map([["f1", ["0xab", "byte"]]]))).toBe(
    "0x0900000008000000ab"
  );

  expect(encode(new Map([["f1", ["0x456789", "Byte3"]]]))).toBe(
    "0x0b00000008000000456789"
  );
});
