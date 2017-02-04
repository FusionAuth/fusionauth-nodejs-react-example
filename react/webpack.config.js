var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'src/');

var config = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.(jsx|js)$/,
        include : APP_DIR,
        loader : 'babel-loader'
      },
      {
        test : /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test : /\.(png|svg|jpg)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  }
};

module.exports = config;
