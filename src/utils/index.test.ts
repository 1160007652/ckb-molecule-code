import { expect, test } from "bun:test";
import { toUint32Le, hexToBytes, bytesToHex, serializeArray } from ".";

test("toUint32Le", () => {
  expect(toUint32Le("0x2b")).toBe("0x2b000000");
  expect(toUint32Le("0x123")).toBe("0x23010000");
  expect(toUint32Le(43n)).toBe("0x2b000000");

  // 着重测试这两个数据
  expect(toUint32Le("0x")).toBe("0x00000000");
  expect(toUint32Le(0n)).toBe("0x00000000");
});

test("bytesToHex", () => {
  expect(bytesToHex(hexToBytes("0x2b000000"))).toBe("0x2b000000");
  expect(bytesToHex(hexToBytes("0x2b"))).toBe("0x2b");
  expect(bytesToHex(hexToBytes(43n))).toBe("0x2b");
  expect(bytesToHex(hexToBytes(430000n))).toBe("0x068fb0");

  // 着重测试这两个数据
  expect(bytesToHex(hexToBytes("0x"))).toBe("0x");
  expect(bytesToHex(hexToBytes(0n))).toBe("0x00");
});

test("serializeArray", () => {
  expect(serializeArray("0x2b000000")).toBe("0x2b000000");
  expect(serializeArray("0x123")).toBe("0x0123");

  expect(serializeArray(Uint8Array.from([43, 0, 0, 0]))).toBe("0x2b000000");

  // 着重测试这两个数据
  expect(serializeArray("0x")).toBe("0x");
  expect(serializeArray(Uint8Array.from([0, 0, 0, 0]))).toBe("0x00000000");
});
