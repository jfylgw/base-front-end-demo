/**
 * @name 加密/解密工具
 * @description
 * @author: gongjf
 * @since: 2019年6月24日 11:12:54
 */

import CryptoJS from "crypto-js";

const key = "xiaxiaxiaxiaxiax";
const iv = "xiaxiaxiaxiaxiax";

export const mode = {
  CBC: CryptoJS.mode.CBC,
  CFB: CryptoJS.mode.CFB,
  CTR: CryptoJS.mode.CTR,
  CTRGladman: CryptoJS.mode.CTRGladman,
  ECB: CryptoJS.mode.ECB,
  OFB: CryptoJS.mode.OFB
};

export const padding = {
  ZeroPadding: CryptoJS.pad.ZeroPadding,
  NoPadding: CryptoJS.pad.NoPadding,
  AnsiX923: CryptoJS.pad.AnsiX923,
  Iso10126: CryptoJS.pad.Iso10126,
  Iso97971: CryptoJS.pad.Iso97971,
  Pkcs7: CryptoJS.pad.Pkcs7
};

const aes_option = {
  iv: CryptoJS.enc.Latin1.parse(iv),
  mode: mode.CBC,
  padding: padding.ZeroPadding
};

const des_option = {
  iv: CryptoJS.enc.Latin1.parse(iv),
  mode: mode.CFB,
  padding: padding.ZeroPadding
};

/**
 * 加密处理
 */
export const encrypt = {
  UTF8(value) {
    return CryptoJS.enc.Utf8.stringify(value);
  },
  Base64(value) {
    return CryptoJS.enc.Base64.stringify(value);
  },
  SHA1(value) {
    return CryptoJS.SHA1(value);
  },
  SHA3(value) {
    return CryptoJS.SHA3(value);
  },
  SHA224(value) {
    return CryptoJS.SHA224(value);
  },
  SHA256(value) {
    return CryptoJS.SHA256(value);
  },
  SHA384(value) {
    return CryptoJS.SHA384(value);
  },
  SHA512(value) {
    return CryptoJS.SHA512(value);
  },
  MD5(value) {
    return CryptoJS.MD5(value);
  },
  AES(value) {
    return CryptoJS.AES.encrypt(value, CryptoJS.enc.Latin1.parse(key), aes_option).toString();
  },
  DES(value) {
    return CryptoJS.DES.encrypt(value, CryptoJS.enc.Latin1.parse(key), des_option).toString();
  }
};

/**
 * 解密处理
 */
export const decrypt = {
  UTF8(value) {
    return CryptoJS.enc.Utf8.parse(value);
  },
  Base64(value) {
    return CryptoJS.enc.Base64.parse(value);
  },
  SHA1(value) {
    return CryptoJS.HmacSHA1(value);
  },
  SHA3(value) {
    return CryptoJS.HmacSHA3(value);
  },
  SHA224(value) {
    return CryptoJS.HmacSHA224(value);
  },
  SHA256(value) {
    return CryptoJS.HmacSHA256(value);
  },
  SHA384(value) {
    return CryptoJS.HmacSHA384(value);
  },
  SHA512(value) {
    return CryptoJS.HmacSHA512(value);
  },
  MD5(value) {
    return CryptoJS.HmacMD5(value);
  },
  AES(value) {
    return CryptoJS.AES.decrypt(value, CryptoJS.enc.Latin1.parse(key), aes_option).toString();
  },
  DES(value) {
    return CryptoJS.DES.decrypt(value, CryptoJS.enc.Latin1.parse(key), des_option).toString();
  }
};
