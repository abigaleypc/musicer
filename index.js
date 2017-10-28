const express = require('express');
const request = require('request')
const app = express();

app.listen(8082)

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

