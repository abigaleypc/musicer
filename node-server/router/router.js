
function createServer(app) {
  console.log('-------------------------LOGIN--------------------------------')
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
          let Authorization  = 'Bearer ' + data.access_token;
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
}

module.exports = createServer;