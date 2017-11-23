const express = require('express');
const request = require('request');

const {
  httpHeader,
  AuthKey,
  playlistUrl,
  access_token,
  lyricUrl
} = require('../config/config');

const app = express();

app.get('/list', function (req, res) {
  let Authorization;
  access_token && (Authorization = 'Bearer ' + access_token);
  request.get(playlistUrl, {
    json: true,
    headers: Object.assign({}, httpHeader, {
      Authorization
    }),
    qs: {
      alt: 'json',
      apikey: AuthKey.apikey,
      app_name: 'radio_iphone',
      channel: 1,
      client: 's:mobile|y:iOS 10.2|f:115|d:' + AuthKey.udid + '|e:iPhone7,1|m:appstore',
      douban_udid: AuthKey.douban_udid,
      formats: 'aac',
      kbps: 128,
      pt: 0.0,
      type: 's',
      udid: AuthKey.udid,
      version: 100
    }
  }).on('error', err => {
    res.status(500).end(err);
  }).on('data', data => {
    try {
      data = JSON.parse(data);
    } catch (err) {

    }
    res.json(data)
  })
});

app.get('/next', function (req, res) {
  let Authorization, sid;
  access_token && (Authorization = 'Bearer ' + access_token);

  if (!(res.query && res.query.sid)) {
    sid = parseInt(Math.random() * 1000000 + 1000000);
  } else {
    sid = req.query.sid;
  }
  request.get('https://douban.fm/j/v2/playlist', {
    json: true,
    headers: Object.assign({}, httpHeader, {
      Authorization
    }),
    qs: {
      'channel': -10,
      'kbps': 128,
      'client': 's:mainsite|y:3.0',
      'app_name': 'radio_website',
      'version': 100,
      'type': 's',
      'sid': sid,
      'pt': '',
      'pb': 128,
      'apikey': ''
    }
  }).on('error', err => {
    res.status(500).end(err);
  }).on('data', data => {
    try {
      data = JSON.parse(data);
      res.json(data)

    } catch (err) {

    }
  })
})


app.get('/like', function (req, res) {

})

app.get('/lyric', function (req, res) {
  if (!req.query || !req.query.sid || !req.query.ssid) {
    res.send({
      code: 0,
      msg: 'Parameters cannot be empty!'
    })
  } else {
    request.get(lyricUrl, {
      json: true,
      headers: httpHeader,
      qs: {
        sid: req.query.sid,
        ssid: req.query.ssid
      }
    }).on('data', (data) => {
      // data = JSON.parse(data);
      // res.json(data)
      data = JSON.parse(data);
      let result = {}

      if (data.lyric == '暂无歌词') {
        result.type = null;
      } else {
        let lyricSplit = data.lyric.split('\r\n'),
          lyricList = [],
          timeList = [],
          time = 0,
          timeSplit = []
        lyricSplit.forEach(it => {
          it.replace(/(\[(.+?)\])?(.*)/, (str, $1, $2, $3) => {
            if ($2) {
              timeSplit = $2.split(':');
              time = Number(timeSplit[0] * 60 + Number(timeSplit[1])).toFixed(2);
              timeList.push(Number(time));
              lyricList.push({
                'time': $1,
                'content': $3
              })
            } else {
              lyricList.push({
                'time': null,
                'content': $3
              })
            }
          })
        })
        if (lyricList[0].time) {
          result.type = 'normal'
        } else {
          result.type = 'noTime'
        }
        result.lyricList = lyricList;
        result.name = data.name;
        result.sid = data.sid;
        result.timeList = timeList;
      }
      res.json(result)
    })
  }
})

module.exports = app;
