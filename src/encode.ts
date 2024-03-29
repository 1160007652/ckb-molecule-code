// table MixedType { f1: Bytes, f2: byte, f3: Uint32, f4: Byte3, f5: Bytes }

type UtilType = "Bytes" | "byte" | "Uint32" | `Byte${number}`;

interface MixedTypeValue {
  type: UtilType;
  value: string;
}

interface MixedType {
  [key: string]: MixedTypeValue;
}

// uint32 低位存储, 00 00 00 00
const offsetSize = 4;
const fullLengthSize = 4;

function encode(molecule: MixedType): string {
  const tables = Object.values(molecule);

  const tableSize = tables.length * offsetSize; // 偏移的字节大小

  const headerLength = fullLengthSize + tableSize;

  let bodyLength = 0;
  let body = "";
  let headerOffsetStep = headerLength;
  let headerOffset = headerLength.toString(16).padStart(2, "0").padEnd(8, "0");

  tables.forEach((item, index) => {
    const _tmp = serializeMixedType(item);
    bodyLength += _tmp.size;
    body += _tmp.value;
    if (index < tables.length - 1) {
      headerOffsetStep += _tmp.size;
      headerOffset += headerOffsetStep
        .toString(16)
        .padStart(2, "0")
        .padEnd(8, "0");
    }
  });

  const headerFullSize = (headerLength + bodyLength)
    .toString(16)
    .padStart(2, "0")
    .padEnd(8, "0");

  const result = `0x${headerFullSize}${headerOffset}${body}`;

  return String(result);
}

function serializeMixedType(moleculeValue: MixedTypeValue) {
  const { type, value } = moleculeValue;
  //  03 00 00 00, ab cd ef
  if (type === "Bytes") {
    if (value == "0x") {
      return {
        value: "00000000",
        size: 4,
      };
    } else {
      // 0xabcdef      03 00 00 00 , ab cd ef --
      const bytesvalue = padStartBytes(value);

      return {
        size: fullLengthSize + bytesvalue.length,
        value: `${String(bytesvalue.length)
          .padStart(2, "0")
          .padEnd(8, "0")}${bytesvalue.join("")}`,
      };
    }
  }

  // 0x123 23 01 00 00
  if (type == "Uint32") {
    return {
      size: fullLengthSize,
      value: padStartUint32(value).join(""),
    };
  }

  //   0x456789      89 67 45 --
  if (/^Byte\d+/g.test(type)) {
    const bytesvalue = padStartBytes(value);
    return {
      size: bytesvalue.length,
      value: bytesvalue.join(""),
    };
  }

  if (type == "byte") {
    const bytesvalue = padStartBytes(value);
    return {
      size: bytesvalue.length,
      value: bytesvalue.join(""),
    };
  }

  return {
    size: 0,
    value: [],
  };
}

function padStartBytes(value: string) {
  const result = value.replace("0x", "");
  const regArry =
    result.length % 2 == 0
      ? result.match(/\w{2}/g)
      : result.padStart(result.length + 1, "0").match(/\w{2}/g);

  if (regArry) {
    return regArry.map((value) => value);
  } else {
    return [];
  }
}

function padStartUint32(value: string) {
  const result = value.replace("0x", "").padStart(8, "0");
  const regArry = result.match(/\w{2}/g);

  if (regArry) {
    return regArry.map((value) => value).reverse();
  } else {
    return [];
  }
}

const data: MixedType = {
  f1: {
    type: "Bytes",
    value: "0x",
  },
  f2: {
    type: "byte",
    value: "0xab",
  },
  f3: {
    type: "Uint32",
    value: "0x123",
  },
  f4: {
    type: "Byte3",
    value: "0x456789",
  },
  f5: {
    type: "Bytes",
    value: "0xabcdef",
  },
};

const result = encode(data);

console.log(JSON.stringify(data, null, 2));
console.log(result);
