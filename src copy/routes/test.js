const express = require('express');
const request = require('request');

const { URL } = require('url')

const app = express();

app.get('/', function (req, res) {
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
    const uri = new URL(response.request.uri.href);

    let headers = response.headers['set-cookie']
    serviceAcount(response.request.uri.href)
  })
    .on('data', data => {
      try {
        data = JSON.parse(data);
      } catch (err) {
      }
      res.json(data);
    })
});

function serviceAcount(url) {
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
    const uri = new URL(response.request.uri.href);

    let headers = response.headers['set-cookie'];
    // [ 'll="118282"; path=/; domain=.douban.com; expires=Sat, 24-Nov-2018 02:30:22 GMT',
    // 'bid=9rFLgcajAtE; Expires=Sat, 24-Nov-18 02:30:22 GMT; Domain=.douban.com; Path=/' ]
    let obj = {}
    let headers2 = (headers[1].split(';'))
    headers2.forEach(str => {
      let it = str.split('=')
      obj[it[0]] = it[1];
    });
    goDouBanFm(response.request.uri.href, obj['bid']);
    getBasic(obj['bid'])
  })
    .on('data', data => {
      try {
        data = JSON.parse(data);
      } catch (err) {
      }
      // res.json(data);
    })
}

function goDouBanFm(url, bid) {
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
    // const uri = new URL(response.request.uri.href);
    let headers = response.headers['set-cookie'];
  })
}



module.exports = app;
