const path = require('path');

module.exports = {
  entry: "./public/entry.js",
  output: {
    path: path.resolve(__dirname, "public/dist"),
    filename: "bundle.js",
    publicPath: "/assets/"
  },
  devtool: "source-map",
  target: "electron",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }]
      }
    ]
  },
  node: {
    dns: 'mock',
    net: 'mock'
  }
};
