export type HexType = `0x${string}`;

export type UtilType = "Bytes" | "byte" | "Uint32" | `Byte${number}`;

export type ISchema = Record<string, UtilType>;
