
const express = require('express');
const path = require("path");
const crypto = require('crypto');
const { PORT } = require('./config/env');
const bodyParser = require('body-parser');

// 解析 XML 的中间件配置
require('body-parser-xml')(bodyParser);


const TOKEN = `tHRPbDgC9E9R`;
const ENCODING_AES_KEY = `UThoK6hfRI24facnbZKsaA8Zpjeh6o1dA1965ioHkuT`
const AES_KEY = Buffer.from(ENCODING_AES_KEY + '=', 'base64');
const CORP_ID = 'your_corp_id_here'; // 企业微信的CorpID

const app = express();



// 配置 XML 解析中间件
app.use(bodyParser.xml({
  limit: '1MB',
  xmlParseOptions: {
      explicitArray: false, // 将 XML 节点作为对象属性，而不是数组
      ignoreAttrs: true // 忽略 XML 属性
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle the WeChat Work callback URL verification
app.get('/callback_url', (req, res) => {
  const { msg_signature, timestamp, nonce, echostr } = req.query;

  console.log(req.query);

  // Step 1: Sort the token, timestamp, and nonce
  const sortedParams = [TOKEN, timestamp, nonce, echostr].sort().join('');

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
      res.status(400).send('Verification failed');
  }
});

// 接收消息的路由
app.post('/callback_url', (req, res) => {
  const { msg_signature, timestamp, nonce } = req.query;

  // 打印 query 和 body 数据
  if (!req.body || !req.body.xml || !req.body.xml.Encrypt) {
      console.error("Invalid XML format")
      res.status(400).send('Invalid XML format');
      return;
  }

  const encryptedMessage = req.body.xml.Encrypt;

  // 验证签名
  const sortedParams = [TOKEN, timestamp, nonce, encryptedMessage].sort().join('');
  const hash = sha1(sortedParams);

  if (hash !== msg_signature) {
      console.error("Invalid signature");
      res.status(400).send('Invalid signature');
      return;
  }

  // 解密消息
  const decryptedMessage = decrypt(encryptedMessage);

  // 处理解密后的消息，示例中只是打印出来
  console.log('Decrypted message:', decryptedMessage);

  // 如果不需要回复内容，直接返回200 OK
  res.status(200).send('');
});


// 提供静态文件
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
