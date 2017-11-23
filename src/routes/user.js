const express = require('express');
const request = require('request');
const LKV = require('../utils/lkv');

const {
  httpHeader,
  AuthKey,
  loginUrl,
  access_token
} = require('../config/config');

const user = express();

user.get('/info', (req, res) => {
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

user.post('/login', function (req, res) {
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
});

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

module.exports = user;
