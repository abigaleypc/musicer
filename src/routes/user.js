const express = require('express')
const request = require('request')
const LKV = require('../utils/lkv')

const {httpHeader, AuthKey, loginUrl, basicUrl, doubanFmUrl, userCkUrl, doubanFmHeader, doubanComHeader} = require('../config/config')

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
  request.post(basicUrl, {
    json: true,
    headers: Object.assign({}, httpHeader, {
    Authorization}),
    qs: {
      source: 'fm',
      referer: doubanFmUrl,
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
    LKV.set(`${username}_basic_info`,data)
    res.send(data)
  })
})

function getUserBid (username) {
  request.get(doubanFmUrl, {
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
    request.get(userCkUrl, {
      json: true,
      headers: Object.assign(
        {},
        doubanFmHeader,
        {
          'Cookie': `flag="ok"; 
          bid=${bid}; 
          ac=${user.ac}; 
          dbcl2=${user.dbcl2}`
        })
    }).on('response', function (response) {
      // let headers = response.headers['set-cookie']
      // let value = getValueByKey(headers, 'ck')
      // console.log('------------------------------------');
      // console.log(value);
      // console.log('------------------------------------');
      // LKV.get(`${username}_sensitive_info`).then(obj => {
      //   LKV.set(`${username}_sensitive_info`, Object.assign({}, obj, { ck: value }))
      //   return obj
      // }).then((data) => {
      //   console.log(`success: ${data}`)
      // })

      // LKV.get(`${username}_sensitive_info`).then((data) => {
      //   console.log(`success: ${data}`)
      // })
    })
  })
}

function getUserAc (username) {
  request.get(doubanFmUrl, {
    json: true,
    headers: Object.assign(
      {},
      doubanFmHeader
    )
  }).on('response', function (response) {
    serviceAcount(response.request.uri.href, username)
  })
}

function serviceAcount (url, username) {
  request.get(url, {
    json: true,
    followRedirect: false,
    headers: Object.assign(
      {},
      doubanComHeader
    )
  }).on('response', function (response) {
    let headers = response.headers['set-cookie']
    let bid = getValueByKey(headers, 'bid')
    goDouBanFm(response.request.uri.href, bid, username)
  })
}

function goDouBanFm (url, bid, username) {
  request.get(url, {
    json: true,
    headers: Object.assign(
      {},
      doubanFmHeader,
      {
        'Cookie': `flag="ok"; bid=${bid}`
      }
    ),
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
