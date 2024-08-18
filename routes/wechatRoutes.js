const express = require("express");
const router = express.Router();
const { sha1, decrypt } = require("../utils/crypto");
const {
  WECHAT_TOKEN,
} = require("../config/env");

router.get("/callback", (req, res) => {
  const { msg_signature, timestamp, nonce, echostr } = req.query;

  console.log(req.query);

  // Step 1: Sort the token, timestamp, and nonce
  const sortedParams = [WECHAT_TOKEN, timestamp, nonce, echostr]
    .sort()
    .join("");

  // Step 2: SHA1 hash of the concatenated string
  const hash = sha1(sortedParams);

  // Step 3: Verify if the hash matches msg_signature
  if (hash === msg_signature) {
    // Step 4: Decrypt the echostr
    const decryptedMessage = decrypt(echostr);

    console.log(decryptedMessage);

    // Return the decrypted message if verification is successful
    res.send(decryptedMessage);
  } else {
    res.status(400).send("Verification failed");
  }
});

// 接收消息的路由
router.post("/callback", (req, res) => {
  const { msg_signature, timestamp, nonce } = req.query;

  // 打印 query 和 body 数据
  if (!req.body || !req.body.xml || !req.body.xml.Encrypt) {
    console.error("Invalid XML format");
    res.status(400).send("Invalid XML format");
    return;
  }

  const encryptedMessage = req.body.xml.Encrypt;

  // 验证签名
  const sortedParams = [TOKEN, timestamp, nonce, encryptedMessage]
    .sort()
    .join("");
  const hash = sha1(sortedParams);

  if (hash !== msg_signature) {
    console.error("Invalid signature");
    res.status(400).send("Invalid signature");
    return;
  }

  // 解密消息
  const decryptedMessage = decrypt(encryptedMessage);

  // 处理解密后的消息，示例中只是打印出来
  console.log("Decrypted message:", decryptedMessage);

  // 如果不需要回复内容，直接返回200 OK
  res.status(200).send("");
});

module.exports = router;
