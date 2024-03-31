import { expect, test } from "bun:test";
import type { IMolecule, IMoleculeType } from "../types";
import encode from "./encode";

const deserialized: IMolecule = {
  f1: "0x",
  f2: "0xab",
  f3: "0x123",
  f4: "0x456789",
  f6: "0xabcdef",
};

const deserializedType: IMoleculeType<typeof deserialized> = {
  f1: "Bytes",
  f2: "byte",
  f3: "Uint32",
  f4: "Byte3",
  f6: "Bytes",
};

test("table: encode", () => {
  expect(encode(deserialized, deserializedType)).toBe(
    "0x2b000000180000001c0000001d000000210000002400000000000000ab2301000045678903000000abcdef"
  );

  expect(encode({ f1: "0x" }, { f1: "Bytes" })).toBe(
    "0x0c0000000800000000000000"
  );

  expect(encode({ f1: "0x0" }, { f1: "Uint32" })).toBe(
    "0x0c0000000800000000000000"
  );

  expect(encode({ f1: "0x00" }, { f1: "Uint32" })).toBe(
    "0x0c0000000800000000000000"
  );

  expect(encode({ f1: "0xab" }, { f1: "byte" })).toBe("0x0900000008000000ab");

  expect(encode({ f1: "0x456789" }, { f1: "Byte3" })).toBe(
    "0x0b00000008000000456789"
  );
});
