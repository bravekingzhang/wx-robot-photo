const axios = require('axios');
const { WECHAT_CORP_ID, WECHAT_SECRET } = require('../config/env');

let accessToken = null;
let tokenExpireTime = 0;

async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpireTime) {
    return accessToken;
  }

  try {
    const response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken`, {
      params: {
        corpid: WECHAT_CORP_ID,
        corpsecret: WECHAT_SECRET,
      },
    });

    if (response.data.errcode === 0) {
      accessToken = response.data.access_token;
      tokenExpireTime = now + (response.data.expires_in - 300) * 1000; // Subtract 5 minutes for safety
      return accessToken;
    } else {
      throw new Error(`Failed to get access token: ${response.data.errmsg}`);
    }
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

async function sendMessage(message) {
  try {
    const token = await getAccessToken();
    const response = await axios.post(
      `https://qyapi.weixin.qq.com/cgi-bin/kf/send_msg?access_token=${token}`,
      message
    );
    if (response.data.errcode !== 0) {
      throw new Error(`Failed to send message: ${response.data.errmsg}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

module.exports = { getAccessToken, sendMessage };