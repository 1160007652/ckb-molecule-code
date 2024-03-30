export type HexType = `0x${string}`;

export type UtilType = "Bytes" | "byte" | "Uint32" | `Byte${number}`;

export type IMolecule = Record<string, HexType | Uint8Array>;

export type IMoleculeType<T> = {
  [K in keyof T]: UtilType;
};
