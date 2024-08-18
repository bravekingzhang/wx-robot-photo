const express = require('express');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const path = require('path');
const { PORT } = require('./config/env');
const wechatRoutes = require('./routes/wechatRoutes');
const staticRoutes = require('./routes/staticRoutes');

const app = express();

app.use(bodyParser.xml({
  limit: '1MB',
  xmlParseOptions: {
    explicitArray: false,
    ignoreAttrs: true
  }
}));

app.use('/wechat', wechatRoutes);
app.use('/', staticRoutes);

// 提供静态文件
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});