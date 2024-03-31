// table MixedType { f1: Bytes, f2: byte, f3: Uint32, f4: Byte3, f5: Bytes }

import type { HexType, UtilType } from "../types";
import {
  deserializeArray,
  deserializeBytes,
  deserializeU32,
  hexToBytes,
} from "../utils";

// uint32 低位存储, 00 00 00 00
const offsetSize = 4;

export default function decode(
  msg: HexType,
  moleculeType: UtilType[]
): HexType[] {
  const msgBytes = hexToBytes(msg);

  const offsetBytes = groupUint8ArrayUint32(
    msgBytes.slice(offsetSize, offsetSize * (moleculeType.length + 1)),
    offsetSize
  );

  const bodyBytes = offsetBytes.map((offset, index) => {
    return msgBytes.slice(offset, offsetBytes[index + 1]);
  });

  const bodys: HexType[] = [];

  bodyBytes.forEach((body, index) => {
    const itemType = moleculeType[index];

    if (itemType == "Uint32") {
      bodys.push(deserializeU32(body));
    }
    if (itemType === "byte") {
      bodys.push(deserializeArray(body));
    }
    if (/^Byte\d+/g.test(itemType)) {
      bodys.push(deserializeArray(body));
    }
    if (itemType === "Bytes") {
      bodys.push(deserializeBytes(body));
    }
  });

  return bodys;
}

function groupUint8ArrayUint32(
  uint8Array: Uint8Array,
  groupSize: number
): number[] {
  const result: number[] = [];
  for (let i = 0; i < uint8Array.length; i += groupSize) {
    // 取 32 位的 uint
    const number = new Uint32Array(
      new Uint8Array(Array.from(uint8Array.slice(i, i + groupSize))).buffer
    )[0];
    result.push(number);
  }
  return result;
}
