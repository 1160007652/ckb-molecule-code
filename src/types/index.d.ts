export type HexType = `0x${string}`;

export type UtilType = "Bytes" | "byte" | "Uint32" | `Byte${number}`;

export type IMolecule = Map<string, [HexType | Uint8Array, UtilType]>;
