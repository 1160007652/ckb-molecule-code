import type { HexType } from "../types";

export class MoleculeError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "MoleculeError";
  }
}

export const toUint32Le = (uint32: HexType | bigint): HexType => {
  // 4字节 32位长度
  const ab = new ArrayBuffer(4);

  if (ab.byteLength !== 4) {
    throw new MoleculeError("ArrayBuffer memory allocation failed");
  }

  const dataView = new DataView(ab);

  // littleEndian 参数
  // true  表示，低位汇编存储格式 (这里根据Molecule规范, 采用低位存储)
  // false 表示，高位汇编存储格式
  dataView.setUint32(0, Number(uint32), true);

  // 得到完整的 4字节 高位存储 hex str
  const hexString = dataView.getUint32(0, false).toString(16).padStart(8, "0");

  return `0x${hexString}`;
};

export const hexToBytes = (hex: HexType | bigint): Uint8Array => {
  let hexStr =
    typeof hex == "bigint" ? hex.toString(16) : hex.replace(/^0x/i, "");

  // 补全完整字节数据 (偶数 - 2位 == 1个字节)
  hexStr = hexStr.length % 2 ? `0${hexStr}` : hexStr;

  // 初始化对应字节的存储空间
  const bytes = new Uint8Array(hexStr.length / 2);

  // 每2位【1个字节】为一组存入 bytes 中
  // --> 此处不再使用之前的 Reg 正则表达式进行分割 <--
  for (let i = 0; i < hexStr.length; i += 2) {
    bytes.set([parseInt(hexStr.slice(i, i + 2), 16)], i / 2);
  }

  return bytes;
};

export const bytesToHex = (bytes: Uint8Array): HexType => {
  const hexString = [...bytes]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `0x${hexString}`;
};

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
