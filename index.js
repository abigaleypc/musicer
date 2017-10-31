const express = require('express');
const request = require('request');

const { httpHeader, AuthKey } = require('./config/config');

const LKV = require('./utils/lkv');

const PORT = process.env.PORT || 8082;
const app = express();

const loginUrl = 'https://www.douban.com/service/auth2/token';
const playlistUrl = 'https://api.douban.com/v2/fm/playlist';

let access_token = "0a95c075f8a9d30d1fc14161e9fd7927";

app.post('/login', function (req, res) {
  var params = Object.assign({}, AuthKey, {
    username: req.query.username,
    password: req.query.password
  })
  request.post(loginUrl, {
    json: true,
    headers: httpHeader,
    qs: params
  }).on('error', err => {
    res.status(500).end(err);
  }).on('data', data => {
    try {
      data = JSON.parse(data);
      if (data.access_token) {
        LKV.set(params.username, data);
        res.json({ code: 1, msg: 'success',douban_user_name:data.douban_user_name })
      } else {
        res.json({ code: 0, msg: 'fail' })
      }
    } catch (err) {
      res.json({ code: 0, msg: 'fail' })
    }
  });
})

app.get('/playlist', function (req, res) {

  let Authorization;

  access_token && (Authorization = 'Bearer ' + access_token)
  request.get(playlistUrl, {
    json: true,
    headers: Object.assign({}, httpHeader, { Authorization }),
    qs: {
      alt: 'json',
      apikey: AuthKey.apikey,
      app_name: 'radio_iphone',
      channel: 10,
      client: 's:mobile|y:iOS 10.2|f:115|d:' + AuthKey.udid + '|e:iPhone7,1|m:appstore',
      douban_udid: AuthKey.douban_udid,
      formats: 'aac',
      kbps: 128,
      pt: 0.0,
      type: 'n',
      udid: AuthKey.udid,
      version: 115
    }
  }).on('error', err => {
    res.status(500).end(err);
  }).on('data', data => {
    try {
      data = JSON.parse(data)
    } catch (err) {

    }
    res.json(data)
  })
})


app.listen(PORT, () => {
  console.log(`The server has been set up at 0.0.0.0:${PORT}`);
});
