const path = require('path');

module.exports = {
  entry: {
    bundle: "./public/entry.js",
    login: "./public/login.js"
  },
  output: {
    path: path.resolve(__dirname, "public/dist"),
    filename: "[name].js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react',]
          }
        }]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      }
    ]
  },
  node: {
    dns: 'mock',
    net: 'mock',
    fs: 'empty',
    tls: 'empty'
  }
};
