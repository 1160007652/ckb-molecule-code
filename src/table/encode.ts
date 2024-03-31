// table MixedType { f1: Bytes, f2: byte, f3: Uint32, f4: Byte3, f5: Bytes }

import type { HexType, IMolecule, IMoleculeType } from "../types";
import {
  bytesToHex,
  hexToBytes,
  serializeArray,
  serializeBytes,
  toUint32Le,
} from "../utils";

// uint32 低位存储, 00 00 00 00
const offsetSize = 4;

export default function encode<T extends IMolecule>(
  molecule: T,
  moleculeType: IMoleculeType<T>
): HexType {
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
