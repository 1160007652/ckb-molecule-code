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
const offsetSize = 8;
const fullLengthSize = 8;

function decode(encodeMsg: string, molecule: MixedType): any {
  const tables = Object.keys(molecule);

  encodeMsg = encodeMsg.replace("0x", "");

  const headerOffsetArray = encodeMsg
    .slice(offsetSize, offsetSize * (tables.length + 1))
    .match(/\w{8}/g)
    ?.map((item) => parseInt(`0x${item.replace(/0+$/, "")}`, 16) * 2);

  if (!headerOffsetArray) throw "error";

  const bodyMolecule = headerOffsetArray.map((item, index) => {
    return encodeMsg.slice(item, headerOffsetArray[index + 1]);
  });

  tables.forEach((item, index) => {
    if (molecule[item].type == "Bytes") {
      const bytesValue = `${bodyMolecule[index].replace(/0+$/, "")}`;
      if (bytesValue == "") {
        molecule[item].value = "0x";
      } else {
        molecule[item].value = `0x${bytesValue.slice(8)}`;
      }
    }

    if (molecule[item].type == "byte") {
      molecule[item].value = `0x${bodyMolecule[index].replace(/0+$/, "")}`;
    }

    if (/^Byte\d+/g.test(molecule[item].type)) {
      molecule[item].value = `0x${bodyMolecule[index].replace(/0+$/, "")}`;
    }

    if (molecule[item].type == "Uint32") {
      let uint32Value = [
        ...bodyMolecule[index].replace(/0+$/, "").matchAll(/\w{2}/g),
      ];
      uint32Value = uint32Value.reverse();

      molecule[item].value = `0x${uint32Value.join("").replace(/^0+/, "")}`;
    }
  });

  return molecule;
}

const data =
  "0x2b000000180000001c0000001d000000210000002400000000000000ab2301000045678903000000abcdef";

const schema: MixedType = {
  f1: {
    type: "Bytes",
    value: "",
  },
  f2: {
    type: "byte",
    value: "",
  },
  f3: {
    type: "Uint32",
    value: "",
  },
  f4: {
    type: "Byte3",
    value: "",
  },
  f5: {
    type: "Bytes",
    value: "",
  },
};

const result = decode(data, schema);
console.log(data);
console.log(result);
