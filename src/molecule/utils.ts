import type { HexType } from "../types";
import { bytesToHex, hexToBytes, toUint32Le } from "../utils";

export const serializeArray = (value: HexType | Uint8Array): HexType => {
  if (value instanceof Uint8Array) {
    return bytesToHex(value);
  }
  return bytesToHex(hexToBytes(value));
};

export const deserializeArray = serializeArray;

export const serializeBytes = (value: HexType | Uint8Array): HexType => {
  const body = serializeArray(value);

  // 计算个数 Bytes 序列化时 的前缀
  const valueSize = body.slice(2).length / 2;

  return `0x${toUint32Le(bytesToHex(hexToBytes(BigInt(valueSize)))).slice(
    2
  )}${body.slice(2)}`;
};

export const deserializeBytes = (value: Uint8Array): HexType => {
  return serializeArray(value.slice(4));
};

export const deserializeU32 = (value: Uint8Array): HexType => {
  // return `0x${(parseInt(toUint32Le(bytesToHex(value)), 16) & 0xfffffff)
  //   .toString(16)
  //   .padStart(2, "0")}`;

  const dv = new DataView(value.buffer);
  return `0x${dv.getUint32(0, true).toString(16)}`;
};

export const groupUint8ArrayUint32 = (
  uint8Array: Uint8Array,
  groupSize: number
): number[] => {
  const result: number[] = [];
  for (let i = 0; i < uint8Array.length; i += groupSize) {
    // 取 32 位的 uint
    const number = new Uint32Array(
      new Uint8Array(Array.from(uint8Array.slice(i, i + groupSize))).buffer
    )[0];
    result.push(number);
  }
  return result;
};
