var { decodeList, padLeft } = require("./lib/src.ts/protostone");

var decodeListHex = (s) => decodeList(Buffer.from(s, "hex"));
var decodeListBigInt = (n) => decodeListHex(padLeft(n.toString(16)));
var getProtostones = (hex) =>
  decodeListHex(hex).reduce(
    (() => {
      let terminated = false;
      return (r, v, i, ary) => {
        if (terminated) return r;
        if (i % 2 === 0) {
          if (v === 16383n) {
            return r + padLeft(ary[i + 1].toString(16));
          }
          if (v === 0n) terminated = true;
        }
        return r;
      };
    })()
  );

var { encodeProtorunesWalletInput } = require("./lib/src.ts/wallet");
var { decodeWalletOutput } = require("metashrew-runes/lib/src.ts/wallet");

const payload = encodeProtorunesWalletInput(
  "bcrt1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqvg32hk",
  BigInt("0x400000000000000000")
);
var fn = async () =>
  await (
    await fetch("http://localhost:8080", {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        method: "metashrew_view",
        params: ["protorunesbyaddress", payload, "latest"],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

var decode = async () => {
  console.log(await fn());
  decodeWalletOutput(Buffer.from((await fn()).result.substr(2), "hex"));
};

// var { encodeW } = require("./lib/src.ts/");
// var { decodeWalletOutput } = require("metashrew-runes/lib/src.ts/wallet");

// const payload2 = encodeProtorunesWalletInput(
//   "bcrt1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqvg32hk",
//   BigInt("0x400000000000000000")
// );
// var fn = async () =>
//   await (
//     await fetch("http://localhost:8080", {
//       method: "POST",
//       body: JSON.stringify({
//         jsonrpc: "2.0",
//         id: 0,
//         method: "metashrew_view",
//         params: ["protorunesbyaddress", payload, "latest"],
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//   ).json();

// var decode = async () => {
//   console.log(await fn());
//   decodeWalletOutput(Buffer.from((await fn()).result.substr(2), "hex"));
// };
