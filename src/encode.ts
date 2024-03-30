// table MixedType { f1: Bytes, f2: byte, f3: Uint32, f4: Byte3, f5: Bytes }

import type { HexType } from "./types";
import {
  bytesToHex,
  hexToBytes,
  serializeArray,
  serializeBytes,
  toUint32,
  toUint32Le,
} from "./utils";

type UtilType = "Bytes" | "byte" | "Uint32" | `Byte${number}`;

type IMolecule = Record<string, HexType | Uint8Array>;

type IMoleculeType<T> = {
  [K in keyof T]: UtilType;
};

// uint32 低位存储, 00 00 00 00
const offsetSize = 4;

function encode<T extends IMolecule>(
  molecule: T,
  moleculeType: IMoleculeType<T>
): string {
  // 提取编码元素的key键, 用于映射
  const moleculeKeys = Object.keys(molecule);

  // FullSize + offsetSize => headerSize
  const headerSize = (moleculeKeys.length + 1) * offsetSize;

  // 存储每一个 molecule 转换后的编码
  const bodys: string[] = [];

  let headerOffSetStep = headerSize;
  let offsetHex = toUint32Le(`0x${headerSize.toString(16)}`).slice(2);

  // 序列化 不同类型的 molecule 元素
  moleculeKeys.forEach((key, index) => {
    const itemType = moleculeType[key];
    const itemvalue = molecule[key];

    if (itemType == "Uint32") {
      bodys.push(toUint32Le(serializeArray(itemvalue)).slice(2));
    }
    if (itemType === "byte") {
      bodys.push(serializeArray(itemvalue).slice(2));
    }
    if (/^Byte\d+/g.test(itemType)) {
      bodys.push(serializeArray(itemvalue).slice(2));
    }
    if (itemType === "Bytes") {
      bodys.push(serializeBytes(itemvalue).slice(2));
    }

    if (index < moleculeKeys.length - 1) {
      headerOffSetStep += bodys[index].length / 2;
      offsetHex += toUint32Le(`0x${headerOffSetStep.toString(16)}`).slice(2);
    }
  });

  const bodyHex = bodys.join("");

  const headerHex = toUint32Le(
    bytesToHex(hexToBytes(BigInt(headerSize + bodyHex.length / 2)))
  );

  return `${headerHex}${offsetHex}${bodyHex}`;
}

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

const result = encode(deserialized, deserializedType);

console.log(JSON.stringify([deserialized, deserializedType], null, 2));
console.log(result);
