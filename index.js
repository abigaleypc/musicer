const express = require('express');
const request = require('request');
const LKV = require('./utils/lkv');
const { userInfo } = require('./src/routes');

const { lyric, nextSong } = require('./mocks/index');

const {
  httpHeader,
  AuthKey,
  loginUrl,
  playlistUrl,
  access_token,
  lyricUrl
} = require('./config/config');

const PORT = process.env.PORT || 8082;
const app = express();

app.use('/userInfo', userInfo);

app.post('/login', function (req, res) {
  let Authorization;
  access_token && (Authorization = 'Bearer ' + access_token);

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
        getBasic(params.username, params.password, Authorization).then(result => {
          if (result.status == 'failed') {
            res.json({
              code: -1,
              msg: 'failed',
              payload: result.payload
            })
          } else {
            res.json({
              code: 1,
              msg: 'success',
              payload: result.payload
            })
          }
        });

      } else {
        res.json({
          code: 0,
          msg: 'failed'
        })
      }
    } catch (err) {
      res.json({
        code: 0,
        msg: 'failed'
      })
    }
  });
})

function getBasic(username, password, Authorization) {
  return new Promise((resolve, reject) => {
    request.post('https://accounts.douban.com/j/popup/login/basic', {
      json: true,
      headers: Object.assign({}, httpHeader, {
        Authorization
      }),
      qs: {
        source: 'fm',
        referer: 'https://douban.fm/',
        ck: 'L-UM',
        name: username,
        password: password,
        captcha_solution: null,
        captcha_id: null
      }
    }).on('error', err => {
      reject(err);
    }).on('data', data => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err)
      }
    })
  })
}

app.get('/playlist', function (req, res) {
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

app.get('/nextSong', function (req, res) {
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
    } catch (err) {

    }
    // res.json(data)
    res.json(nextSong)
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
      // res.json(JSON.parse(data))
      res.json(lyric)
    })
  }
})

app.listen(PORT, () => {
  console.log(`The server has been set up at 0.0.0.0:${PORT}`);
});

// if (process.env.NODE_ENV === 'dev') {
//   const electronHot = require('electron-hot-loader');
//   electronHot.install();
//   electronHot.watchJsx(['public/**/*.jsx']);
//   electronHot.watchCss(['public/**/*.css']);
// }
