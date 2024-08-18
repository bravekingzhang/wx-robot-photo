const crypto = require("crypto");

function sha1(str) {
  const hash = crypto.createHash("sha1");
  hash.update(str);
  return hash.digest("hex");
}

function decrypt(echostr) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    AES_KEY,
    AES_KEY.slice(0, 16)
  );
  decipher.setAutoPadding(false);

  let decrypted = Buffer.concat([
    decipher.update(echostr, "base64"),
    decipher.final(),
  ]);
  decrypted = PKCS7Decoder(decrypted);

  // Remove the first 16 random bytes
  const content = decrypted.slice(16);
  const length = content.slice(0, 4).readUInt32BE(0);
  const message = content.slice(4, 4 + length).toString();
  //   const corpId = content.slice(4 + length).toString();

  return message;
}

function PKCS7Decoder(buff) {
  const pad = buff[buff.length - 1];
  if (pad < 1 || pad > 32) {
    return buff;
  }
  return buff.slice(0, buff.length - pad);
}

module.exports = { sha1, decrypt };
