const express = require('express');
const request = require('request');

const app = express();

app.get('/',function (req,res) {
  request.get('https://douban.fm',{
    json:true,
    headers:{
      'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding':'gzip, deflate, br',
      'Accept-Language':'zh-CN,zh;q=0.9,en;q=0.8',
      'Connection':'keep-alive',
      'Host':'douban.fm',
      'Upgrade-Insecure-Requests':1,
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    }
  }).on('response',function (response) {
    const uri =new URL(response.request.uri.href);

    // let headers = response.headers.toString()
    console.log(uri.searchParams.get('sig'))
  })
  .on('data', data => {
    try {
      data = JSON.parse(data);
    } catch (err) {
    }
    res.json(data);
  })
});

module.exports = app;
