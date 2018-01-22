const express = require('express')
const request = require('request')
const { URL } = require('url')
const LKV = require('../utils/lkv')

const {httpHeader, AuthKey, loginUrl, doubanFmHeader,doubanComHeader} = require('../config/config')

const user = express()

user.get('/info', (req, res) => {
  LKV.getAll()
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      res.status(502).send({
        errCode: -1,
        errMsg: err
      })
    })
})

user.get('/loginByToken', (req, res) => {
  LKV.get(`${req.query.username}_token_info`).then(result => {
    if (result.access_token == req.query.token) {
      res.json({
        code: 1,
        msg: 'success',
        data: result
      })
    } else {
      res.json({
        code: 0,
        msg: '无效token，请重新登录'
      })
    }
  })
  res.json({
    code: -1,
    msg: '无效token，请重新登录'
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
    res.status(500).end(err)
  }).on('data', data => {
    try {
      data = JSON.parse(data)
      if (data.access_token) {
        LKV.set(`${req.query.username}_token_info`, data)
        res.json({
          code: 1,
          msg: 'success',
        data})
      } else {
        res.json({
          code: 0,
          msg: data.msg
        })
      }
    } catch (err) {
      res.json({
        code: 0,
        msg: 'failed'
      })
    }
  })
})

user.get('/basic', function (req, res) {
  let {username, password, solution, id} = req.query
  let Authorization = 'Bearer ' + req.query.token
  request.post('https://accounts.douban.com/j/popup/login/basic', {
    json: true,
    headers: Object.assign({}, httpHeader, {
    Authorization}),
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
    let headers = response.headers['set-cookie']
    let value = getValueByKey(headers, 'dbcl2')
    let obj = {}
    LKV.set(`${username}_sensitive_info`, Object.assign({}, obj, { dbcl2: value }))
    getUserAc(username)
  }).on('error', err => {
  }).on('data', data => {
    res.send(data)
  })
})

function getUserBid (username) {
  request.get('https://douban.fm', {
    json: true,
    headers: httpHeader
  }).on('response', function (response) {
    let headers = response.headers['set-cookie']
    let value = getValueByKey(headers, 'bid')

    LKV.get(`${username}_sensitive_info`).then(obj => {
      LKV.set(`${username}_sensitive_info`, Object.assign({}, obj, { bid: value }))
    }).then(() => {
      getUserCk(username, value)
    })
  })
}

function getUserCk (username, bid) {
  let user
  LKV.get(`${username}_sensitive_info`).then(res => {
    user = res
  }).then(() => {
    request.get('https://douban.fm/j/check_loggedin?san=1', {
      json: true,
      // headers:Object.assign({},doubanFmHeader,{'Cookie': `flag="ok"; bid=${bid}; ac=${user.ac}; dbcl2=${user.dbcl2}`}),
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
        
      }
    }).on('response', function (response) {
      let headers = response.headers['set-cookie']
      let value = getValueByKey(headers, 'ck')
      LKV.get(`${username}_sensitive_info`).then(obj => {
        LKV.set(`${username}_sensitive_info`, Object.assign({}, obj, { ck: value }))
        return obj
      }).then((data) => {
        console.log('------------------------------------')
        console.log(data)
        console.log('------------------------------------')
      })
    })
  })
}

function getUserAc (username) {
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
    serviceAcount(response.request.uri.href, username)
  })
}

function serviceAcount (url, username) {
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
    let headers = response.headers['set-cookie']
    let bid = getValueByKey(headers, 'bid')
    goDouBanFm(response.request.uri.href, bid, username)
  })
}

function goDouBanFm (url, bid, username) {
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
    let headers = response.headers['set-cookie']
    let value = getValueByKey(headers, 'ac')
    LKV.get(`${username}_sensitive_info`).then(obj => {
      LKV.set(`${username}_sensitive_info`, Object.assign({}, obj, { ac: value }))
    }).then(() => {
      getUserBid(username)
    })
  })
}

function getValueByKey (array, key) {
  let obj = {}
  let newArray = []
  array.forEach(it => {
    let newItem = it.split(';')
    newArray = newArray.concat(newItem)
  })
  newArray.forEach(it => {
    let newItem = it.trim().split('=')
    obj[newItem[0]] = newItem[1]
  })
  return obj[key]
}
module.exports = user
