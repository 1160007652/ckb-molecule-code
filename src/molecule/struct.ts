import { OFFSETSIZE } from "../constants";
import type { HexType, ISchema } from "../types";
import { bytesToHex, hexToBytes, toUint32Le } from "../utils";
import {
  deserializeArray,
  deserializeBytes,
  deserializeU32,
  groupUint8ArrayUint32,
  serializeArray,
  serializeBytes,
} from "./utils";

class StructLayout<T extends ISchema> {
  #schema: T;
  #fileds: (keyof T)[];

  constructor(schema: T, fileds: (keyof T)[]) {
    this.#schema = schema;
    this.#fileds = fileds;
  }

  encode(data: Record<keyof T, HexType>): HexType {
    // 存储每一个 molecule 转换后的编码
    const bodys: string[] = [];

    // 序列化 不同类型的 molecule 元素
    this.#fileds.forEach((item, index) => {
      const utilType = this.#schema[item];
      const hexValue = data[item];

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
        bodys.push(serializeArray(hexValue).slice(2));
        // bodys.push(serializeBytes(hexValue).slice(2));
      }
    });

    const bodyHex = bodys.join("");

    return `0x${bodyHex}`;
  }

  decode(data: HexType): Record<keyof T, HexType> | null {
    const msgBytes = hexToBytes(data);

    // const offsetBytes = groupUint8ArrayUint32(
    //   msgBytes.slice(OFFSETSIZE, OFFSETSIZE * (this.#fileds.length + 1)),
    //   OFFSETSIZE
    // );

    // const bodyBytes = offsetBytes.map((offset, index) => {
    //   return msgBytes.slice(offset, offsetBytes[index + 1]);
    // });

    // const bodys: Record<keyof T, HexType> = {} as Record<keyof T, HexType>;

    // this.#fileds.forEach((item, index) => {
    //   const itemType = this.#schema[item];
    //   const body = bodyBytes[index];

    //   if (itemType == "Uint32") {
    //     bodys[item] = deserializeU32(body);
    //   }
    //   if (itemType === "byte") {
    //     bodys[item] = deserializeArray(body);
    //   }
    //   if (/^Byte\d+/g.test(itemType)) {
    //     bodys[item] = deserializeArray(body);
    //   }
    //   if (itemType === "Bytes") {
    //     bodys[item] = deserializeArray(body);
    //   }
    // });

    return null;
  }
}

export default StructLayout;
