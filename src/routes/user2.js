const express = require('express');
const request = require('request');
const { URL } = require('url');
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
        LKV.set('username', params.username);
        LKV.set('token', data)
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

            getUserAc(params.username);
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
    }).on('response', function (response) {
      // get dbcl2
      let headers = response.headers['set-cookie'];
      let value = getValueByKey(headers, 'dbcl2');
      // LKV.get(username).then(obj => {
      //   LKV.set(username, Object.assign({}, obj, { dbcl2: value }))
      // })
      LKV.set('dbcl2', value)
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

function getUserBid(username) {
  request.get('https://douban.fm', {
    json: true,
    headers: httpHeader
  }).on('response', function (response) {
    let headers = response.headers['set-cookie'];
    let value = getValueByKey(headers, 'bid');

    // LKV.get(username).then(obj => {
    //   LKV.set(username, Object.assign({}, obj, { bid: value }))
    // })
    LKV.set('bid', value)

    getUserCk(username);
  })
}


function getUserCk(username) {
  let ac, bid, dbcl2;

  LKV.get('ac').then(res => {
    ac = res;
  }).then(() => {
    LKV.get('bid').then(res => {
      bid = res
    }).then(() => {
      LKV.get('dbcl2').then(res => {
        dbcl2 = res;
      })
    }).then(() => {
      request.get('https://douban.fm/j/check_loggedin?san=1', {
        json: true,
        headers: {
          'Host': 'douban.fm',
          'Connection': 'keep-alive',
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
          'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': 'https://douban.fm/',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Cookie': `flag="ok"; bid=${bid}; ac=${ac}; dbcl2=${dbcl2}`
        }
      }).on('response', function (response) {
        console.log('------------------------------------');
        console.log(bid);
        console.log(ac);
        console.log(dbcl2);
        console.log('------------------------------------');
        let headers = response.headers['set-cookie']
        let ck = getValueByKey(headers, 'ck');
        console.log('------------------------------------');
        console.log(ck);
        console.log('------------------------------------');
      })
    })
  })


}
function getUserAc(username) {
  request.get('https://douban.fm', {
    json: true,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Connection': 'keep-alive',
      'Host': 'douban.fm',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    }
  }).on('response', function (response) {
    let headers = response.headers['set-cookie']
    console.log(headers)
    serviceAcount(response.request.uri.href, username)
  })
}

function serviceAcount(url, username) {
  request.get(url, {
    json: true,
    followRedirect: false,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Host': 'www.douban.com',
      'Pragma': 'no-cache',
      'Referer': 'https://douban.fm/',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    }
  }).on('response', function (response) {
    let headers = response.headers['set-cookie'];
    let bid = getValueByKey(headers, 'bid')
    goDouBanFm(response.request.uri.href, bid, username);
  })
}

function goDouBanFm(url, bid, username) {
  let headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Cookie': `flag="ok"; bid=${bid}`,
    'Host': 'douban.fm',
    'Pragma': 'no-cache',
    'Referer': 'https://douban.fm/',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
  }

  request.get(url, {
    json: true,
    headers: headers,
    followRedirect: false
  }).on('response', function (response) {
    let headers = response.headers['set-cookie'];
    let value = getValueByKey(headers, 'ac');
    // LKV.get(username).then(obj => {
    //   LKV.set(username, Object.assign({}, obj, { ac: value }))
    // }).then(() => {
    LKV.set('ac', value);
    getUserBid(username);
    // })
  })
}

function getValueByKey(array, key) {
  let obj = {}
  let newArray = [];
  array.forEach(it => {
    let newItem = it.split(';');
    newArray = newArray.concat(newItem);
  })
  newArray.forEach(it => {
    let newItem = it.trim().split('=');
    obj[newItem[0]] = newItem[1];
  })
  return obj[key]
}
module.exports = user;
