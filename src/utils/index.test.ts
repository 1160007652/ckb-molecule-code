import { expect, test } from "bun:test";
import { toUint32Le, hexToBytes, bytesToHex } from ".";

test("utils: toUint32Le", () => {
  expect(toUint32Le("0x2b")).toBe("0x2b000000");
  expect(toUint32Le("0x123")).toBe("0x23010000");
  expect(toUint32Le(43n)).toBe("0x2b000000");

  // 着重测试这两个数据
  expect(toUint32Le("0x")).toBe("0x00000000");
  expect(toUint32Le(0n)).toBe("0x00000000");
});

test("utils: bytesToHex", () => {
  expect(bytesToHex(hexToBytes("0x2b000000"))).toBe("0x2b000000");
  expect(bytesToHex(hexToBytes("0x2b"))).toBe("0x2b");
  expect(bytesToHex(hexToBytes(43n))).toBe("0x2b");
  expect(bytesToHex(hexToBytes(430000n))).toBe("0x068fb0");

  // 着重测试这两个数据
  expect(bytesToHex(hexToBytes("0x"))).toBe("0x");
  expect(bytesToHex(hexToBytes(0n))).toBe("0x00");
});
