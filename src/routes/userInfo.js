const express = require('express');
const LKV = require('../../utils/lkv');

const userInfo = express();

userInfo.get('/', (req, res) => {
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

module.exports = userInfo;
