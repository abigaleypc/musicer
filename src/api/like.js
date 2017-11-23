const express = require('express');
const request = require('request');

const app = express();


app.get('/like', (req, res) => {
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