// import CryptoJs from "crypto-js";

// export const encrypt = (text: string) => {
//   const encrypted = CryptoJs.AES.encrypt(text, "57a2662f857c5277d27007d3724bb46401ad3f1593628d8766ccb86980c79760").toString();
//   console.log(encrypted);

//   return encrypted;
// };

// export const decrypt = (encrypted: string) => {
//   const bytes = CryptoJs.AES.decrypt(encrypted, "57a2662f857c5277d27007d3724bb46401ad3f1593628d8766ccb86980c79760");
//   const originalText = bytes.toString(CryptoJs.enc.Utf8);
//   return originalText;
// };

import sha256 from "crypto-js/sha256";

/**
 * 加密函数
 * @param text 密码明文
 * @returns 加密后的密码
 */
export const encrypt = (text: string) => {
  const encrypted = sha256(text).toString();
  return encrypted;
};
