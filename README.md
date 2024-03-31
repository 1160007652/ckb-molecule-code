
# ckb

To install dependencies:

```bash
bun install
```

To run:

```bash
bun test
```

This project was created using `bun init` in bun v1.0.33. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Molecule 

```
vector Bytes <bytes>;
array Uint32 [byte;32];
array Byte3 [byte;3];

table MixedType { 
  f1: Bytes, 
  f2: byte, 
  f3: Uint32, 
  f4: Byte3, 
  f5: Bytes,
}
```

> table MixedType { f1: Bytes, f2: byte, f3: Uint32, f4: Byte3, f5: Bytes }

> MixedType { f1: 0x, f2: 0xab, f3: 0x123, f4: 0x456789, f5: 0xabcdef }

```
【Table Encode】

空字节的序列化字节为00 00 00 00（任何空固定向量的长度为0)

Bytes  0x            00 00 00 00

byte   0xab          ab -- -- --

Uint32 0x123         23 01 00 00

Byte3  0x456789      45 67 89 --

Bytes  0xabcdef      03 00 00 00, ab cd ef --    



byte  原始字节序列， 0xab => ab
Bytes 序列，0xabc => 02 00 00 00, 0a bc



完整大小为 43（0x2b）字节
2b 00 00 00

五个偏移量（总共 20 字节）
18 00 00 00, 1c 00 00 00, 1d 00 00 00, 21 00 00 00, 24 00 00 00

五个项目（总共 19 字节）
00 00 00 00
ab
23 01 00 00
45 67 89
03 00 00 00, ab cd ef



结果：
2b 00 00 00, 18 00 00 00, 1c 00 00 00, 1d 00 00 00, 21 00 00 00, 24 00 00 00, 00 00 00 00, ab, 23 01 00 00, 45 67 89, 03 00 00 00, ab cd ef
```
----