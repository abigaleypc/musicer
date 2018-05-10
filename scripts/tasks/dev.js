'use strict';
const chalk = require('chalk');

// webpack
// const webpack = require('webpack');
// const WebpackDevServer = require('webpack-dev-server');
// const { createCompiler } = require('react-dev-utils/WebpackDevServerUtils');

process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
})

// const devConf = require('../webpack/webpack.config')
// // projects
// const paths = require('../paths')();

startDevServer();

// start development
function startDevServer() {
}


const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack/webpack.config');
console.log('Starting the dev web server...');
const port = 8080;

const options = {
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  contentBase: 'www',
  stats: { colors: true }
};

const server = new WebpackDevServer(webpack(config), options);

server.listen(port, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }
  console.log(chalk.red('WebpackDevServer listening at localhost:', port));
});

