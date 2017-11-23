const express = require('express');
const {user, test, song} = require('./src/routes');

const PORT = process.env.PORT || 8082;
const app = express();

app.use('/user', user);
app.use('/test', test);
app.use('/song', song);

app.listen(PORT, () => {
  console.log(`The server has been set up at 0.0.0.0:${PORT}`);
});

// if (process.env.NODE_ENV === 'dev') {
//   const electronHot = require('electron-hot-loader');
//   electronHot.install();
//   electronHot.watchJsx(['public/**/*.jsx']);
//   electronHot.watchCss(['public/**/*.css']);
// }
