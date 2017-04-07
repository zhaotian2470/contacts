var webpack = require("webpack");
var path = require("path");

var DEV = path.resolve(__dirname, "dev");
var OUTPUT = path.resolve(__dirname, "client/output");

var config = {
  entry: {
    index: DEV + "/index.jsx",
    login: DEV + "/login.jsx"
  },
  output: {
    path: OUTPUT,
    filename: "[name].js"
  },
  module: {
    loaders: [{
      include: DEV,
      loader: "babel-loader",
    }]
  }
};

module.exports = config;
