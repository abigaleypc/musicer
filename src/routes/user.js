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

user.get('/loginByToken', (req, res) => {
  LKV.get(req.query.id).then(result => {
    if (result.access_token == req.query.token) {
      console.log('------------------------------------');
      console.log(result.access_token);
      console.log(req.query.token);
      console.log('------------------------------------');
      LKV.get(req.query.token).then(basic => {
        console.log('------------------------------------');
        console.log(basic);
        console.log('------------------------------------');
        res.json(basic);
      })
    } else {
      res.json({
        code: 0,
        msg: '无效token，请重新登录'
      })
    }
  })
})
user.post('/login', function (req, res) {
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
        LKV.set(data.douban_user_id, data); //用于根据ID匹配token
        res.json({
          code: 1,
          msg: 'success',
          data
        })
      } else {
        res.json({
          code: 0,
          msg: data.msg,
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

user.get('/basic', function (req, res) {
  let user_id = req.query.user_id;
  let Authorization;
  let username = req.query.username;
  let password = req.query.password;
  let captcha_solution = req.query.captcha_solution ? req.query.captcha_solution : null;
  let captcha_id = req.query.captcha_id ? req.query.captcha_id : null;
  LKV.get(user_id).then(data => {
    Authorization = 'Bearer ' + data.access_token
  })
  console.log('------------------------------------');
  console.log(req.query);
  console.log('------------------------------------');
  request.post('https://accounts.douban.com/j/popup/login/basic', {
    json: true,
    headers: Object.assign({}, httpHeader, {
      Authorization
    }),
    qs: {
      name: username,
      password: password,
      captcha_solution,
      captcha_id
    }
  }).on('error', err => {
    res.json(err)
  }).on('data', data => {
    data = JSON.parse(data);
    try {
      if (data.message == 'success') {
        let result = {
          code: 1,
          msg: 'success',
          data: data.payload.account_info
        }
        LKV.set(`${user_id}basic`, data.payload.account_info)
        res.json(result);
      } else if (data.message == 'captcha_required') {
        let result = {
          code: -1,
          msg: 'captcha_required',
          data: data.payload
        }
        res.json(result);
      } else {
        let result = {
          code: 0,
          msg: 'get basic failed',
          data: data.payload
        }
        res.json(result);
      }
    } catch (err) {
      let result = {
        code: 0,
        msg: 'get basic failed',
        data: err
      }
      res.json(result);
    }
  })
})


function getBasic(username, password, Authorization, id, solution) {
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
        captcha_solution: solution ? solution : null,
        captcha_id: id ? id : null
      }
    }).on('response', function (response) {
      // get dbcl2
      let headers = response.headers['set-cookie'];
      let value = getValueByKey(headers, 'dbcl2');
      LKV.get(username).then(obj => {
        LKV.set(username, Object.assign({}, obj, { dbcl2: value }))
      })
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

    getUserCk(username, value);
    LKV.get(username).then(obj => {
      LKV.set(username, Object.assign({}, obj, { bid: value }))
    })
  })
}


function getUserCk(username, bid) {
  let user;
  LKV.get(username).then(res => {
    user = res;
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
        'Cookie': `flag="ok"; bid=${bid}; ac=${user.ac}; dbcl2=${user.dbcl2}`
      }
    }).on('response', function (response) {
      let headers = response.headers['set-cookie']
      let ck = getValueByKey(headers, 'ck');
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
    LKV.get(username).then(obj => {
      LKV.set(username, Object.assign({}, obj, { ac: value }))
    }).then(() => {
      getUserBid(username);
    })
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
