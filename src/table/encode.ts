// table MixedType { f1: Bytes, f2: byte, f3: Uint32, f4: Byte3, f5: Bytes }

import type { HexType, IMolecule } from "../types";
import {
  bytesToHex,
  hexToBytes,
  serializeArray,
  serializeBytes,
  toUint32Le,
} from "../utils";

// uint32 低位存储, 00 00 00 00
const offsetSize = 4;

export default function encode(molecule: IMolecule): HexType {
  // FullSize + offsetSize => headerSize
  const headerSize = (molecule.size + 1) * offsetSize;

  // 存储每一个 molecule 转换后的编码
  const bodys: string[] = [];

  let headerOffSetStep = headerSize;
  let offsetHex = toUint32Le(`0x${headerSize.toString(16)}`).slice(2);
  let index = 0;

  // 序列化 不同类型的 molecule 元素
  molecule.forEach(([hexValue, utilType], objKey) => {
    if (utilType == "Uint32") {
      bodys.push(toUint32Le(serializeArray(hexValue)).slice(2));
    }
    if (utilType === "byte") {
      bodys.push(serializeArray(hexValue).slice(2));
    }
    if (/^Byte\d+/g.test(utilType)) {
      bodys.push(serializeArray(hexValue).slice(2));
    }
    if (utilType === "Bytes") {
      bodys.push(serializeBytes(hexValue).slice(2));
    }

    if (index < molecule.size - 1) {
      headerOffSetStep += bodys[index].length / 2;
      offsetHex += toUint32Le(`0x${headerOffSetStep.toString(16)}`).slice(2);
      index++;
    }
  });

  const bodyHex = bodys.join("");

  const headerHex = toUint32Le(
    bytesToHex(hexToBytes(BigInt(headerSize + bodyHex.length / 2)))
  );

  return `${headerHex}${offsetHex}${bodyHex}`;
}
