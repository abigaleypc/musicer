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
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader" // 将 JS 字符串生成为 style 节点
        }, {
          loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
        }, {
          loader: "less-loader" // 将 Less 编译成 CSS
        }]
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
