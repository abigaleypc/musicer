const express = require('express');
const request = require('request');

const { httpHeader, AuthKey } = require('./config/config');

const LKV = require('./utils/lkv');

const PORT = process.env.PORT || 8082;
const app = express();

const loginUrl = 'https://www.douban.com/service/auth2/token';
const playlistUrl = 'https://api.douban.com/v2/fm/playlist';

let access_token = "0a95c075f8a9d30d1fc14161e9fd7927";

app.get('/userInfo', (req, res) => {
  LKV.getAll()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(502).send({
        errCode: -1,
        errMsg: err
      });
    })
});

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
        let Authorization = Authorization = 'Bearer ' + data.access_token;
        getBasic(params.username, params.password, Authorization).then(result => {
          if (result.status == 'failed') {
            res.json({ code: -1, msg: 'failed', payload: result.payload })
          } else {
            res.json({ code: 1, msg: 'success', payload: result.payload })
          }
        });

      } else {
        res.json({ code: 0, msg: 'failed' })
      }
    } catch (err) {
      res.json({ code: 0, msg: 'failed' })
    }
  });
})

function getBasic(username, password, Authorization) {
  return new Promise((resolve, reject) => {
    request.post('https://accounts.douban.com/j/popup/login/basic', {
      json: true,
      headers: Object.assign({}, httpHeader, { Authorization }),
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
      result = { code: 500 }
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
      data = JSON.parse(data);
    } catch (err) {

    }
    res.json(data)
  })
})

app.get('/like', function (req, res) {

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

