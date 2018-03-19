const express = require('express');
const {user, test, song} = require('./src/routes');

const PORT = process.env.PORT || 8082;
const server = express();

server.use('/user', user);
server.use('/song', song);

server.listen(PORT, () => {
  console.log(`The server has been set up at 0.0.0.0:${PORT}`);
});




// server.use('/test', test);
