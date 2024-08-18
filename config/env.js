require('dotenv').config();

module.exports = {
  WECHAT_TOKEN: process.env.WECHAT_TOKEN,
  WECHAT_ENCODING_AES_KEY: process.env.WECHAT_ENCODING_AES_KEY,
  WECHAT_CORP_ID: process.env.WECHAT_CORP_ID,
  WECHAT_SECRET: process.env.WECHAT_SECRET,
  PORT: process.env.PORT || 3000,
};