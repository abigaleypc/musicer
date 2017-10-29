const express = require('express');
const request = require('request');

const app = express();

client.on('error', error => {
  console.error(`Redis created failed with ERROR: ${error}`);
});

app.listen(8082);

const url = 'https://www.douban.com/service/auth2/token';

app.get('/login', function (req, res, next) {
  var myJSONObject = {
    apikey: '02646d3fb69a52ff072d47bf23cef8fd',
    client_id: '02646d3fb69a52ff072d47bf23cef8fd',
    client_secret: 'cde5d61429abcd7c',
    udid: 'b88146214e19b8a8244c9bc0e2789da68955234d',
    douban_udid: 'b635779c65b816b13b330b68921c0f8edc049590',
    device_id: 'b88146214e19b8a8244c9bc0e2789da68955234d',
    grant_type: 'password',
    redirect_uri: 'http://www.douban.com/mobile/fm',
    username: req.query.username,
    password: req.query.password
  };
  request.post('https://www.douban.com/service/auth2/token', {
    json: true,
    headers: {
      "Accept": "text/javascript, text/html, application/xml, text/xml, */*",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": "https://douban.fm/",
      "Accept-Encoding": "utf-8",
      "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6"
    },
    qs: myJSONObject
  }).on('error', err => {
    res.status(500).end(err);
  }).on('data', data => {
    try {
      data = JSON.parse(data);
    } catch (err) {}
    res.json(data);
  });
})

app.get('/get_douban_fm', function (req, res, next) {
  let sid = (req.query.sid ? req.query.sid : 2234059);
  request.get({
    uri: 'https://douban.fm/j/v2/playlist',
    json: true,
    headers: {
      "Accept": "text/javascript, text/html, application/xml, text/xml, */*",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": "https://douban.fm/",
      "Accept-Encoding": "utf-8",
      "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6",
      "cookie": "bid=hotqFYIyV0A; flag=\\\"ok\\\"; ac=\\\"1509029994\\\"; _ga=GA1.2.1741905202.1509025644; _gid=GA1.2.1972327550.1509025644",
    },
    qs: {
      channel: -10,
      kbps: 192,
      client: 's%3Amainsite%7Cy%3A3.0',
      app_name: 'radio_website',
      version: 100,
      type: 's',
      sid: sid,
      pt: '',
      pb: 128,
      apikey: ''
    }

  }, (err, response, data) => {
    res.send(data)
  })
})

